#include "parser.h"

#include <iostream>

int main(int argc, char* argv[])
{
    if (argc != 3)
    {
        std::cout
            << "Usage:\n"
            << "tcp_latency <capture.pcap> <analysis.json>"
            << std::endl;

        return 1;
    }

    PacketParser parser;

    if (!parser.parse(argv[1], argv[2]))
    {
        return 1;
    }

    return 0;
}