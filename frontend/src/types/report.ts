export interface Packet {
    packetNumber: number;

    srcIp: string;
    dstIp: string;

    srcPort: number;
    dstPort: number;

    sequenceNumber: number;
    acknowledgementNumber: number;

    payloadLength: number;

    matched: boolean;
    latency: number;

    retransmission: boolean;
    duplicateAck: boolean;

    syn: boolean;
    ack: boolean;
    fin: boolean;
    rst: boolean;
    psh: boolean;
    urg: boolean;
}

export interface Summary {
    totalTcpPackets: number;
    dataPackets: number;
    pureAckPackets: number;

    matchedPackets: number;

    retransmissions: number;
    duplicateAcks: number;

    minimumLatency: number;
    averageLatency: number;
    maximumLatency: number;
}

export interface AnalysisReport {
    captureFile: string;
    summary: Summary;
    packets: Packet[];
}

export interface AnalyzeResponse {
    success: boolean;
    report: AnalysisReport;
}