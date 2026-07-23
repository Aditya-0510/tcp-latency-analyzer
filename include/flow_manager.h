#pragma once

#include <unordered_map>
#include <string>

struct OutstandingPacket
{
    uint64_t packetNumber;

    double timestamp;

    uint32_t expectedAck;
};

struct FlowKey
{
    std::string endpointA;
    std::string endpointB;

    bool operator==(const FlowKey& other) const;
};

struct Flow
{
    std::unordered_map<uint32_t, OutstandingPacket> waitingAck;
};