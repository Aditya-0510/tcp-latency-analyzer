import SummaryCard from "./SummaryCard";
import { Summary } from "../types/report";

interface SummaryCardsProps {
    summary: Summary;
}

export default function SummaryCards({
    summary,
}: SummaryCardsProps) {
    return (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
                title="Total TCP Packets"
                value={summary.totalTcpPackets}
            />

            <SummaryCard
                title="Data Packets"
                value={summary.dataPackets}
            />

            <SummaryCard
                title="Pure ACK Packets"
                value={summary.pureAckPackets}
            />

            <SummaryCard
                title="Matched Packets"
                value={summary.matchedPackets}
                accent="success"
            />

            <SummaryCard
                title="Retransmissions"
                value={summary.retransmissions}
                accent={summary.retransmissions > 0 ? "danger" : "default"}
            />

            <SummaryCard
                title="Duplicate ACKs"
                value={summary.duplicateAcks}
                accent={summary.duplicateAcks > 0 ? "warning" : "default"}
            />

            <SummaryCard
                title="Average Latency"
                value={summary.averageLatency.toFixed(2)}
                unit="ms"
            />

            <SummaryCard
                title="Maximum Latency"
                value={summary.maximumLatency.toFixed(2)}
                unit="ms"
            />
        </section>
    );
}