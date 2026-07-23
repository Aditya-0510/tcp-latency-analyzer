#include "flow_manager.h"

#include <iostream>

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
    return packet.srcIp == key.first.ip &&
           packet.srcPort == key.first.port;
}

std::vector<AckMatch>
FlowManager::process(const TcpPacket& packet)
{
    std::vector<AckMatch> matches;

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
    // Ignore pure control packets
    //------------------------------------------------------

    bool carriesData =
        packet.payloadLength > 0;

    if (carriesData)
    {
        uint32_t expectedAck =
            packet.sequenceNumber +
            packet.payloadLength;

        if (packet.syn)
            expectedAck++;

        if (packet.fin)
            expectedAck++;

        //--------------------------------------------------
        // Retransmission detection
        //--------------------------------------------------

       bool retransmission =
            sendStream.outstanding.find(
                packet.sequenceNumber)
            != sendStream.outstanding.end();

        if (retransmission)
        {
            sendStream.retransmissions++;

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

        segment.packetNumber =
            packet.packetNumber;

        segment.sequenceNumber =
            packet.sequenceNumber;

        segment.expectedAck =
            expectedAck;

        segment.payloadLength =
            packet.payloadLength;

        segment.sendTime =
            packet.timestamp;

        segment.retransmitted =
            retransmission;

        /*
         * Keep the FIRST transmission.
         *
         * RTT/ACK latency should be measured
         * from the original send time.
         */

        if (!retransmission)
        {
            sendStream.outstanding.emplace(
                segment.sequenceNumber,
                segment);
        }
    }

    //------------------------------------------------------
    // Ignore packets without ACK flag
    //------------------------------------------------------

    if (!packet.ack)
    {
        return matches;
    }

    //------------------------------------------------------
    // ACK processing starts here
    //------------------------------------------------------
        //------------------------------------------------------
    // Duplicate ACK detection
    //------------------------------------------------------

    if (packet.acknowledgementNumber ==
        receiveStream.lastAck)
    {
        receiveStream.duplicateAckCount++;

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
        receiveStream.lastAck =
            packet.acknowledgementNumber;

        receiveStream.duplicateAckCount = 1;
    }

    //------------------------------------------------------
    // Cumulative ACK processing
    //------------------------------------------------------

    auto it = receiveStream.outstanding.begin();

while(it != receiveStream.outstanding.end())
{
    OutstandingSegment& segment =
        it->second;

    if(segment.expectedAck >
       packet.acknowledgementNumber)
    {
        ++it;
        continue;
    }

    AckMatch match;

    match.packetNumber =
        segment.packetNumber;

    match.sequenceNumber =
        segment.sequenceNumber;

    match.acknowledgementNumber =
        packet.acknowledgementNumber;

    match.sendTime =
        segment.sendTime;

    match.ackTime =
        packet.timestamp;

    match.latency =
        packet.timestamp -
        segment.sendTime;

    if(match.latency >= 0.0)
    {
        matches.push_back(match);
    }

    it =
        receiveStream.outstanding.erase(it);
}

    return matches;
}