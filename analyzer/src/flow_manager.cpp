#include "flow_manager.h"

#include <iostream>

namespace
{
    /*
     * TCP sequence numbers wrap around at 2^32. Plain '<' / '>' / '=='
     * comparisons break once a stream crosses that boundary, so all
     * sequence-space comparisons go through these wraparound-safe
     * helpers instead (standard technique: compare via signed
     * subtraction).
     */

    bool seqLessThanOrEqual(uint32_t a, uint32_t b)
    {
        return static_cast<int32_t>(a - b) <= 0;
    }

    bool seqGreaterThan(uint32_t a, uint32_t b)
    {
        return static_cast<int32_t>(a - b) > 0;
    }
}

FlowKey FlowManager::createFlowKey(const TcpPacket& packet)
{
    Endpoint src{
        packet.srcIp,
        packet.srcPort
    };

    Endpoint dst{
        packet.dstIp,
        packet.dstPort
    };

    FlowKey key;

    if (src < dst)
    {
        key.first = src;
        key.second = dst;
    }
    else
    {
        key.first = dst;
        key.second = src;
    }

    return key;
}

bool FlowManager::isForwardPacket(
    const FlowKey& key,
    const TcpPacket& packet)
{
    return packet.srcIp == key.first.ip && packet.srcPort == key.first.port;
}

FlowProcessResult
FlowManager::process(const TcpPacket& packet)
{
    FlowProcessResult result;

    //------------------------------------------------------
    // Find (or create) TCP Flow
    //------------------------------------------------------

    FlowKey key = createFlowKey(packet);

    TcpFlow& flow = flows[key];

    flow.key = key;

    //------------------------------------------------------
    // Determine direction
    //------------------------------------------------------

    bool forward = isForwardPacket(key, packet);

    TcpStream& sendStream =
        forward
            ? flow.forward
            : flow.reverse;

    TcpStream& receiveStream =
        forward
            ? flow.reverse
            : flow.forward;

    //------------------------------------------------------
    // A SYN marks the (re)start of a connection's sequence
    // space on this side. Reset this stream's tracking state
    // so leftover data from a previous connection that reused
    // the same 4-tuple (e.g. an old, never-fully-drained
    // connection on the same ephemeral port) can't bleed into
    // this one and produce spurious retransmission matches.
    //------------------------------------------------------

    if (packet.syn)
    {
        sendStream.outstanding.clear();
        sendStream.lastAck = 0;
        sendStream.duplicateAckCount = 0;
        sendStream.highestAcked = 0;
        sendStream.hasHighestAcked = false;
    }

    //------------------------------------------------------
    // Ignore pure control packets
    //------------------------------------------------------

    bool carriesData = packet.payloadLength > 0;

    if (carriesData)
    {
        uint32_t expectedAck = packet.sequenceNumber + packet.payloadLength;

        if (packet.syn)
            expectedAck++;

        if (packet.fin)
            expectedAck++;

        //--------------------------------------------------
        // Retransmission detection
        //--------------------------------------------------
        //
        // A segment is treated as a retransmission if either:
        //
        //   (a) The exact same sequence number AND payload
        //       length are already sitting in 'outstanding'
        //       (i.e. this exact segment was sent before and
        //       is still unacknowledged). Requiring the length
        //       to match too avoids misclassifying an
        //       unrelated new segment that happens to start at
        //       the same sequence number (e.g. after a stream
        //       reset edge case) as a retransmission.
        //
        //   (b) The segment's range is already fully covered
        //       by the highest ACK this stream has received so
        //       far. This catches spurious retransmissions of
        //       data that was already acknowledged - a case the
        //       'outstanding' map alone misses, since the
        //       original entry is erased as soon as it's ACKed.
        //
        // Both comparisons use wraparound-safe sequence
        // arithmetic.
        //--------------------------------------------------

        bool retransmission = false;

        auto existing = sendStream.outstanding.find(packet.sequenceNumber);

        if (existing != sendStream.outstanding.end() &&
            existing->second.payloadLength == packet.payloadLength)
        {
            retransmission = true;
        }

        if (!retransmission &&
            sendStream.hasHighestAcked &&
            seqLessThanOrEqual(expectedAck, sendStream.highestAcked))
        {
            retransmission = true;
        }

        if (retransmission)
        {
            sendStream.retransmissions++;
            result.retransmission = true;

            std::cout
                << "[Retransmission] Packet #"
                << packet.packetNumber
                << " SEQ="
                << packet.sequenceNumber
                << std::endl;
        }

        //--------------------------------------------------
        // Store segment
        //--------------------------------------------------

        OutstandingSegment segment;

        segment.packetNumber = packet.packetNumber;
        segment.sequenceNumber = packet.sequenceNumber;
        segment.expectedAck = expectedAck;
        segment.payloadLength = packet.payloadLength;
        segment.sendTime = packet.timestamp;
        segment.retransmitted = retransmission;

        /*
         * Keep the FIRST transmission.
         *
         * RTT/ACK latency should be measured
         * from the original send time.
         */

        if (!retransmission)
        {
            sendStream.outstanding.emplace( segment.sequenceNumber, segment);
        }
    }

    //------------------------------------------------------
    // Ignore packets without ACK flag
    //------------------------------------------------------

    if (!packet.ack)
    {
        return result;
    }

    //------------------------------------------------------
    // ACK processing starts here
    //------------------------------------------------------

    //------------------------------------------------------
    // Duplicate ACK detection
    //------------------------------------------------------

    if (packet.acknowledgementNumber == receiveStream.lastAck)
    {
        receiveStream.duplicateAckCount++;
        result.duplicateAck = true;

        if (receiveStream.duplicateAckCount >= 3)
        {
            std::cout
                << "[Duplicate ACK] ACK="
                << packet.acknowledgementNumber
                << " Count="
                << receiveStream.duplicateAckCount
                << std::endl;
        }
    }
    else
    {
        receiveStream.lastAck = packet.acknowledgementNumber;
        receiveStream.duplicateAckCount = 1;
    }

    //------------------------------------------------------
    // Track the high-water mark of acknowledged data for the
    // stream this ACK refers to (receiveStream == the peer's
    // send direction). Used above to catch retransmissions of
    // already-acknowledged data.
    //------------------------------------------------------

    if (!receiveStream.hasHighestAcked ||
        seqGreaterThan(packet.acknowledgementNumber, receiveStream.highestAcked))
    {
        receiveStream.highestAcked = packet.acknowledgementNumber;
        receiveStream.hasHighestAcked = true;
    }

    //------------------------------------------------------
    // Cumulative ACK processing
    //------------------------------------------------------

    auto it = receiveStream.outstanding.begin();

    while (it != receiveStream.outstanding.end())
    {
        OutstandingSegment& segment = it->second;

        if (seqGreaterThan(segment.expectedAck, packet.acknowledgementNumber))
        {
            ++it;
            continue;
        }

        AckMatch match;

        match.packetNumber = segment.packetNumber;
        match.sequenceNumber =  segment.sequenceNumber;
        match.acknowledgementNumber = packet.acknowledgementNumber;
        match.sendTime = segment.sendTime;
        match.ackTime = packet.timestamp;
        match.latency =packet.timestamp - segment.sendTime;

        if (match.latency >= 0.0)
        {
            result.matches.push_back(match);
        }

        it = receiveStream.outstanding.erase(it);
    }

    return result;
}