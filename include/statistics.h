#pragma once

#include "ack_match.h"

#include <limits>

class Statistics
{
public:

    void add(const AckMatch& match);

    void print() const;

private:

    uint64_t matchedPackets = 0;

    double minLatency =
        std::numeric_limits<double>::max();

    double maxLatency = 0.0;

    double totalLatency = 0.0;
};