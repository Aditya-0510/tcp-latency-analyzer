#include "statistics.h"

#include <iostream>
#include <iomanip>

void Statistics::add(const AckMatch& match)
{
    matchedPackets++;

    if (match.latency < minLatency)
    {
        minLatency = match.latency;
    }

    if (match.latency > maxLatency)
    {
        maxLatency = match.latency;
    }

    totalLatency += match.latency;
}

void Statistics::print() const
{
    std::cout << "\n";
    std::cout << "=========================================\n";
    std::cout << "        TCP ACK LATENCY REPORT\n";
    std::cout << "=========================================\n";

    std::cout << "Matched Packets : "
              << matchedPackets
              << "\n";

    if (matchedPackets == 0)
    {
        std::cout << "No ACK matches found.\n";
        std::cout << "=========================================\n";
        return;
    }

    double average =
        totalLatency / matchedPackets;

    std::cout << std::fixed
              << std::setprecision(3);

    std::cout << "Minimum Latency : "
              << minLatency * 1000
              << " ms\n";

    std::cout << "Maximum Latency : "
              << maxLatency * 1000
              << " ms\n";

    std::cout << "Average Latency : "
              << average * 1000
              << " ms\n";

    std::cout << "=========================================\n";
}