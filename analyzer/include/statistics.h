#pragma once

#include "ack_match.h"

#include <cstdint>
#include <limits>

class Statistics
{
public:

    void add(const AckMatch& match);

    /*
     * Call once per successfully parsed TCP packet, before
     * flow processing, to keep the packet-level counters
     * in sync with everything that came through the parser.
     */
    void recordPacket(bool isData, bool isPureAck);

    void recordRetransmission();

    void recordDuplicateAck();

    void print() const;

private:

    // Latency stats (ACK-matched packets only)

    uint64_t matchedPackets = 0;

    double minLatency =
        std::numeric_limits<double>::max();

    double maxLatency = 0.0;

    double totalLatency = 0.0;

    // Packet-level counters

    uint64_t totalTcpPackets = 0;

    uint64_t dataPackets = 0;

    uint64_t pureAckPackets = 0;

    uint64_t retransmissions = 0;

    uint64_t duplicateAcks = 0;
};