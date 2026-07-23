#include "parser.h"
#include "packet.h"
#include "protocols.h"

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
        }
    }

    std::cout << "\nFinished reading "
              << packetNumber
              << " packets."
              << std::endl;

    pcap_close(handle);

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

    if (ntohs(ethernet->etherType) != 0x0800)
        return false;

    //----------------------------------------------------
    // IPv4
    //----------------------------------------------------

    const IPv4Header* ip =
        reinterpret_cast<const IPv4Header*>(
            data + sizeof(EthernetHeader));

    unsigned int ipHeaderLength =
        (ip->versionIhl & 0x0F) * 4;

    if (ip->protocol != 6)
        return false;

    //----------------------------------------------------
    // TCP
    //----------------------------------------------------

    const TCPHeader* tcp =
        reinterpret_cast<const TCPHeader*>(
            data +
            sizeof(EthernetHeader) +
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

    packet.srcPort =
        ntohs(tcp->sourcePort);

    packet.dstPort =
        ntohs(tcp->destinationPort);

    packet.sequenceNumber =
        ntohl(tcp->sequenceNumber);

    packet.acknowledgementNumber =
        ntohl(tcp->acknowledgementNumber);

    packet.payloadLength =
        length -
        sizeof(EthernetHeader) -
        ipHeaderLength -
        tcpHeaderLength;

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