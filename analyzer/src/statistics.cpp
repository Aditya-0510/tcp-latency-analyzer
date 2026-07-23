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

void Statistics::recordPacket(bool isData, bool isPureAck)
{
    totalTcpPackets++;

    if (isData)
    {
        dataPackets++;
    }

    if (isPureAck)
    {
        pureAckPackets++;
    }
}

void Statistics::recordRetransmission()
{
    retransmissions++;
}

void Statistics::recordDuplicateAck()
{
    duplicateAcks++;
}

void Statistics::print() const
{
    std::cout << "\n";
    std::cout << "=========================================\n";
    std::cout << "        TCP ACK LATENCY REPORT\n";
    std::cout << "=========================================\n";

    std::cout << "Total TCP Packets : "
              << totalTcpPackets
              << "\n";

    std::cout << "Data Packets : "
              << dataPackets
              << "\n";

    std::cout << "Pure ACK Packets : "
              << pureAckPackets
              << "\n";

    std::cout << "Retransmissions : "
              << retransmissions
              << "\n";

    std::cout << "Duplicate ACKs : "
              << duplicateAcks
              << "\n";

    std::cout << "-----------------------------------------\n";

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