#pragma once

#include <cstdint>

struct Statistics
{
    uint64_t totalPackets = 0;

    uint64_t tcpPackets = 0;

    uint64_t dataPackets = 0;

    uint64_t ackPackets = 0;

    uint64_t matchedAcks = 0;

    double totalDelay = 0;

    double minimumDelay = 0;

    double maximumDelay = 0;
};