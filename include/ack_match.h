#pragma once

#include <cstdint>

struct AckMatch
{
    uint64_t packetNumber = 0;

    uint32_t sequenceNumber = 0;
    uint32_t acknowledgementNumber = 0;

    double sendTime = 0.0;
    double ackTime = 0.0;

    double latency = 0.0;
};