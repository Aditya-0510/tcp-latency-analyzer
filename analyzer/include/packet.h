#pragma once

#include <string>
#include <cstdint>

struct TcpPacket
{
    uint64_t packetNumber = 0;

    double timestamp = 0.0;

    std::string srcIp;
    std::string dstIp;

    uint16_t srcPort = 0;
    uint16_t dstPort = 0;

    uint32_t sequenceNumber = 0;
    uint32_t acknowledgementNumber = 0;

    uint32_t payloadLength = 0;

    bool syn = false;
    bool ack = false;
    bool fin = false;
    bool rst = false;
    bool psh = false;
    bool urg = false;
};