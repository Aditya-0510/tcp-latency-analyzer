#include "parser.h"
#include "packet.h"
#include "protocols.h"
#include "flow_manager.h"
#include "statistics.h"

#include <pcap.h>

#include <winsock2.h>
#include <ws2tcpip.h>

#include <iostream>

bool PacketParser::parse(const std::string& filename)
{
    char errorBuffer[PCAP_ERRBUF_SIZE];

    pcap_t* handle =
        pcap_open_offline(filename.c_str(), errorBuffer);

    if (!handle)
    {
        std::cerr << "Failed to open PCAP: "
                  << errorBuffer
                  << std::endl;

        return false;
    }

    std::cout << "Opened PCAP: "
              << filename
              << std::endl
              << std::endl;

    std::cout << "Datalink: " << pcap_datalink(handle) << std::endl;

    FlowManager flowManager;
    Statistics statistics;

    struct pcap_pkthdr* header;
    const u_char* rawPacket;

    int result;

    uint64_t packetNumber = 0;

    while ((result = pcap_next_ex(handle, &header, &rawPacket)) >= 0)
    {
        packetNumber++;

        double timestamp =
            header->ts.tv_sec +
            header->ts.tv_usec / 1000000.0;

        TcpPacket packet;

        if (parsePacket(
                rawPacket,
                header->caplen,
                timestamp,
                packetNumber,
                packet))
        {
            printPacket(packet);

            auto matches = flowManager.process(packet);

           for (const auto& match : matches)
            {
                statistics.add(match);

                std::cout
                    << "ACK matched Packet #"
                    << match.packetNumber
                    << "  Latency = "
                    << match.latency * 1000
                    << " ms"
                    << std::endl;
            }
        }
    }

    std::cout << "\nFinished reading "
              << packetNumber
              << " packets."
              << std::endl;

    pcap_close(handle);
    statistics.print();

    return true;
}

bool PacketParser::parsePacket(
    const unsigned char* data,
    unsigned int length,
    double timestamp,
    uint64_t packetNumber,
    TcpPacket& packet)
{
    //----------------------------------------------------
    // Ethernet
    //----------------------------------------------------

    if (length < sizeof(EthernetHeader))
        return false;

    const EthernetHeader* ethernet =
        reinterpret_cast<const EthernetHeader*>(data);

    unsigned int offset = sizeof(EthernetHeader);
    uint16_t etherType = ntohs(ethernet->etherType);

    //----------------------------------------------------
    // Handle 802.1Q / Q-in-Q VLAN tags
    //----------------------------------------------------

    while (etherType == 0x8100 || etherType == 0x88A8)
    {
        if (length < offset + 4)
            return false;

        // 2 bytes tag control info + 2 bytes real etherType
        etherType =
            ntohs(*reinterpret_cast<const uint16_t*>(
                data + offset + 2));

        offset += 4;
    }

    if (etherType != 0x0800)
        return false;

    //----------------------------------------------------
    // IPv4
    //----------------------------------------------------

    if (length < offset + sizeof(IPv4Header))
        return false;

    const IPv4Header* ip =
        reinterpret_cast<const IPv4Header*>(
            data + offset);

    unsigned int ipHeaderLength =
        (ip->versionIhl & 0x0F) * 4;

    if (ip->protocol != 6)
        return false;

    //----------------------------------------------------
    // TCP
    //----------------------------------------------------

    if (length < offset + ipHeaderLength + sizeof(TCPHeader))
        return false;

    const TCPHeader* tcp =
        reinterpret_cast<const TCPHeader*>(
            data +
            offset +
            ipHeaderLength);

    unsigned int tcpHeaderLength =
        ((tcp->dataOffset >> 4) & 0x0F) * 4;

    //----------------------------------------------------
    // Populate TcpPacket
    //----------------------------------------------------

    packet.packetNumber = packetNumber;
    packet.timestamp = timestamp;

    char ipBuffer[INET_ADDRSTRLEN];

    inet_ntop(
        AF_INET,
        &ip->sourceIP,
        ipBuffer,
        sizeof(ipBuffer));

    packet.srcIp = ipBuffer;

    inet_ntop(
        AF_INET,
        &ip->destinationIP,
        ipBuffer,
        sizeof(ipBuffer));

    packet.dstIp = ipBuffer;

    packet.srcPort = ntohs(tcp->sourcePort);
    packet.dstPort = ntohs(tcp->destinationPort);

    packet.sequenceNumber = ntohl(tcp->sequenceNumber);
    packet.acknowledgementNumber = ntohl(tcp->acknowledgementNumber);

    //----------------------------------------------------
    // Payload length — derived from actual captured bytes,
    // not the IP header's totalLength field (which can be
    // wrong/absent under TSO/LSO offload).
    //----------------------------------------------------

    unsigned int headersLength =
        offset +
        ipHeaderLength +
        tcpHeaderLength;

    if (length < headersLength)
        return false;

    packet.payloadLength = length - headersLength;

    packet.syn = tcp->flags & 0x02;
    packet.ack = tcp->flags & 0x10;
    packet.fin = tcp->flags & 0x01;
    packet.rst = tcp->flags & 0x04;
    packet.psh = tcp->flags & 0x08;
    packet.urg = tcp->flags & 0x20;

    return true;
}

void PacketParser::printPacket(const TcpPacket& packet)
{
    std::cout
        << "----------------------------------------"
        << std::endl;

    std::cout
        << "Packet #" << packet.packetNumber
        << std::endl;

    std::cout
        << "Timestamp : "
        << packet.timestamp
        << std::endl;

    std::cout
        << "Source : "
        << packet.srcIp
        << ":"
        << packet.srcPort
        << std::endl;

    std::cout
        << "Destination : "
        << packet.dstIp
        << ":"
        << packet.dstPort
        << std::endl;

    std::cout
        << "Sequence Number : "
        << packet.sequenceNumber
        << std::endl;

    std::cout
        << "Acknowledgement Number : "
        << packet.acknowledgementNumber
        << std::endl;

    std::cout
        << "Payload Length : "
        << packet.payloadLength
        << " bytes"
        << std::endl;

    std::cout << "Flags : ";

    if (packet.syn) std::cout << "SYN ";
    if (packet.ack) std::cout << "ACK ";
    if (packet.fin) std::cout << "FIN ";
    if (packet.psh) std::cout << "PSH ";
    if (packet.rst) std::cout << "RST ";
    if (packet.urg) std::cout << "URG ";

    std::cout << std::endl;
}