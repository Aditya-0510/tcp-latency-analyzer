#pragma once

#include "ack_match.h"
#include "flow.h"
#include "packet.h"

#include <map>
#include <vector>

/*
 * Result of processing a single packet through the flow manager.
 *
 * Separate from AckMatch because a single packet can, at once,
 * complete zero or more ACK matches AND itself be classified as
 * a retransmission and/or a duplicate ACK.
 */
struct FlowProcessResult
{
    std::vector<AckMatch> matches;

    bool retransmission = false;

    bool duplicateAck = false;
};

class FlowManager
{
public:

    FlowProcessResult process(const TcpPacket& packet);

private:

    std::map<FlowKey, TcpFlow> flows;

    FlowKey createFlowKey(const TcpPacket& packet);

    bool isForwardPacket(
        const FlowKey& key,
        const TcpPacket& packet);
};