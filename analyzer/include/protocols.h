#pragma once

#include <cstdint>

#pragma pack(push, 1)

struct EthernetHeader
{
    uint8_t destination[6];
    uint8_t source[6];
    uint16_t etherType;
};

struct IPv4Header
{
    uint8_t versionIhl;
    uint8_t tos;

    uint16_t totalLength;
    uint16_t identification;
    uint16_t flagsFragment;

    uint8_t ttl;
    uint8_t protocol;

    uint16_t checksum;

    uint32_t sourceIP;
    uint32_t destinationIP;
};

struct TCPHeader
{
    uint16_t sourcePort;
    uint16_t destinationPort;

    uint32_t sequenceNumber;
    uint32_t acknowledgementNumber;

    uint8_t dataOffset;
    uint8_t flags;

    uint16_t window;
    uint16_t checksum;
    uint16_t urgentPointer;
};

#pragma pack(pop)