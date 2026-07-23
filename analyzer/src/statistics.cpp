#include "statistics.h"

#include <iostream>
#include <iomanip>
#include <fstream>
#include <iomanip>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

void Statistics::add(const AckMatch& match)
{
    matches.push_back(match);

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

void Statistics::exportJson(const std::string& filename) const
{
    json report;

    report["summary"] =
    {
        { "totalTcpPackets", totalTcpPackets },
        { "dataPackets", dataPackets },
        { "pureAckPackets", pureAckPackets },
        { "matchedPackets", matchedPackets },
        { "retransmissions", retransmissions },
        { "duplicateAcks", duplicateAcks },
        { "minimumLatency", matchedPackets ? minLatency * 1000.0 : 0.0 },
        { "maximumLatency", matchedPackets ? maxLatency * 1000.0 : 0.0 },
        { "averageLatency", matchedPackets ? (totalLatency / matchedPackets) * 1000.0 : 0.0 }
    };

    report["packets"] = json::array();

    for (const auto& packet : packets)
    {
        report["packets"].push_back({
            {"packetNumber", packet.packetNumber},
            {"srcIp", packet.srcIp},
            {"dstIp", packet.dstIp},
            {"srcPort", packet.srcPort},
            {"dstPort", packet.dstPort},
            {"sequenceNumber", packet.sequenceNumber},
            {"acknowledgementNumber", packet.acknowledgementNumber},
            {"payloadLength", packet.payloadLength},
            {"matched", packet.matched},
            {"latency", packet.latency},
            {"retransmission", packet.retransmission},
            {"duplicateAck", packet.duplicateAck},
            {"syn", packet.syn},
            {"ack", packet.ack},
            {"fin", packet.fin},
            {"rst", packet.rst},
            {"psh", packet.psh},
            {"urg", packet.urg}
        });
    }

    std::ofstream out(filename);

    if (out.is_open())
    {
        out << std::setw(4) << report;
    }
}

void Statistics::addPacket(const PacketRecord& packet)
{
    packets.push_back(packet);
}