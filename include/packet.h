#pragma once

#include <cstdint>
#include <string>

struct TcpPacket
{
    uint64_t packetNumber;

    double timestamp;

    std::string srcIp;
    std::string dstIp;

    uint16_t srcPort;
    uint16_t dstPort;

    uint32_t sequenceNumber;
    uint32_t acknowledgementNumber;

    uint32_t payloadLength;

    bool syn = false;
    bool ack = false;
    bool fin = false;
    bool rst = false;
    bool psh = false;
    bool urg = false;
};