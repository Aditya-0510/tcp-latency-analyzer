#pragma once

#include <cstdint>
#include <map>
#include <string>

struct Endpoint
{
    std::string ip;
    uint16_t port;

    bool operator<(const Endpoint& other) const
    {
        if (ip != other.ip)
            return ip < other.ip;

        return port < other.port;
    }

    bool operator==(const Endpoint& other) const
    {
        return ip == other.ip &&
               port == other.port;
    }
};

struct FlowKey
{
    Endpoint first;
    Endpoint second;

    bool operator<(const FlowKey& other) const
    {
        if (first < other.first)
            return true;

        if (other.first < first)
            return false;

        return second < other.second;
    }
};

struct OutstandingSegment
{
    uint64_t packetNumber = 0;

    uint32_t sequenceNumber = 0;

    uint32_t expectedAck = 0;

    uint32_t payloadLength = 0;

    double sendTime = 0.0;

    bool retransmitted = false;
};

struct TcpStream
{
    /*
     * Key = starting sequence number
     */
    std::map<uint32_t, OutstandingSegment> outstanding;

    uint32_t lastAck = 0;

    uint32_t duplicateAckCount = 0;

    uint64_t retransmissions = 0;
};

struct TcpFlow
{
    FlowKey key;

    TcpStream forward;

    TcpStream reverse;
};