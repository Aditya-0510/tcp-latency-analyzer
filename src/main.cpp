#include "parser.h"

#include <iostream>

int main(int argc, char* argv[])
{
    if (argc != 2)
    {
        std::cout
            << "Usage:\n"
            << "tcp_latency <capture.pcap>"
            << std::endl;

        return 1;
    }

    PacketParser parser;

    parser.parse(argv[1]);

    return 0;
}