#pragma once

#include "ack_match.h"
#include "packet_record.h"

#include <cstdint>
#include <limits>
#include <string>
#include <vector>

class Statistics
{
public:

    void add(const AckMatch& match);

    void addPacket(const PacketRecord& packet);

    void recordPacket(bool isData, bool isPureAck);

    void recordRetransmission();

    void recordDuplicateAck();

    void print() const;

    void exportJson(const std::string& filename) const;

private:

    // Store all matched packets for JSON export
    std::vector<PacketRecord> packets;
    std::vector<AckMatch> matches;

    // Latency statistics
    uint64_t matchedPackets = 0;

    double minLatency =
        std::numeric_limits<double>::max();

    double maxLatency = 0.0;

    double totalLatency = 0.0;

    // Packet statistics
    uint64_t totalTcpPackets = 0;

    uint64_t dataPackets = 0;

    uint64_t pureAckPackets = 0;

    uint64_t retransmissions = 0;

    uint64_t duplicateAcks = 0;
};