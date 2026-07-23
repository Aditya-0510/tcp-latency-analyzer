#pragma once

#include <string>
#include <cstdint>

struct PacketRecord
{
    uint64_t packetNumber;

    std::string srcIp;
    std::string dstIp;

    uint16_t srcPort;
    uint16_t dstPort;

    uint32_t sequenceNumber;
    uint32_t acknowledgementNumber;

    uint32_t payloadLength;

    bool syn;
    bool ack;
    bool fin;
    bool rst;
    bool psh;
    bool urg;

    bool matched = false;
    bool retransmission = false;
    bool duplicateAck = false;

    double latency = 0.0;
};