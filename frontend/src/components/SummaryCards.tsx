import SummaryCard from "./SummaryCard";
import { Summary } from "../types/report";

interface SummaryCardsProps {
    summary: Summary;
}

export default function SummaryCards({
    summary,
}: SummaryCardsProps) {
    return (
        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

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
            />

            <SummaryCard
                title="Retransmissions"
                value={summary.retransmissions}
            />

            <SummaryCard
                title="Duplicate ACKs"
                value={summary.duplicateAcks}
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