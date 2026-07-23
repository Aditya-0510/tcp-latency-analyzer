#pragma once

#include "packet.h"

#include <string>

class PacketParser
{
public:

    bool parse(
        const std::string& captureFile,
        const std::string& outputFile);

private:

    bool parsePacket(
        const unsigned char* data,
        unsigned int length,
        double timestamp,
        uint64_t packetNumber,
        TcpPacket& packet);

    void printPacket(const TcpPacket& packet);
};