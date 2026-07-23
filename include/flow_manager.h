#pragma once

#include "ack_match.h"
#include "flow.h"
#include "packet.h"

#include <map>
#include <vector>

class FlowManager
{
public:

    std::vector<AckMatch> process(const TcpPacket& packet);

private:

    std::map<FlowKey, TcpFlow> flows;

    FlowKey createFlowKey(const TcpPacket& packet);

    bool isForwardPacket(
        const FlowKey& key,
        const TcpPacket& packet);
};