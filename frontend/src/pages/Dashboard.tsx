import { useMemo, useState } from "react";

import FileUpload from "../components/FileUpload";
import SummaryCards from "../components/SummaryCards";
import PacketTable from "../components/PacketTable";
import PacketDetails from "../components/PacketDetails";

import { AnalysisReport, Packet } from "../types/report";

import LatencyChart from "../components/LatencyCharts";
import StatusPieChart from "../components/StatusPieChart";
import TopLatencyChart from "../components/TopLatencyChart";

export default function Dashboard() {
    const [report, setReport] = useState<AnalysisReport | null>(null);

    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);

    const [latencyThreshold, setLatencyThreshold] = useState<number | null>(null);

    type StatusFilter =
        | "all"
        | "normal"
        | "matched"
        | "duplicateAck"
        | "retransmission";

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const filteredPackets = useMemo(() => {
        if (!report) return [];

        return report.packets.filter(packet => {

            // Status filter
            switch (statusFilter) {
                case "matched":
                    if (!packet.matched) return false;
                    break;

                case "duplicateAck":
                    if (!packet.duplicateAck) return false;
                    break;

                case "retransmission":
                    if (!packet.retransmission) return false;
                    break;

                case "normal":
                    if (
                        packet.matched ||
                        packet.duplicateAck ||
                        packet.retransmission
                    ) {
                        return false;
                    }
                    break;
            }

            // Latency filter
            if (
                latencyThreshold !== null &&
                (!packet.matched ||
                    packet.latency < latencyThreshold)
            ) {
                return false;
            }

            return true;
        });
    }, [report, latencyThreshold, statusFilter]);

    return (
        <div className="min-h-screen bg-[#0A0E13]">
            <div className="mx-auto max-w-7xl px-8 py-10">

                <header className="mb-8 flex items-center justify-between border-b border-[#1F2830] pb-6">

                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-400" />

                            <span className="text-xs uppercase tracking-widest text-slate-500">
                                Packet Inspector
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-white">
                            TCP ACK Latency Analyzer
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">

                        <label className="text-sm font-medium text-slate-300">
                            Threshold Latency ≥
                        </label>

                       <input
                            type="number"
                            min={0}
                            step={0.1}
                            value={latencyThreshold ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;

                                setLatencyThreshold(
                                    value === "" ? null : Number(value)
                                );
                            }}
                            placeholder="Latency (ms)"
                            className="w-32 rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-white outline-none focus:border-cyan-400"
                        />

                        <span className="text-slate-400">
                            ms
                        </span>

                    </div>

                </header>

                <FileUpload
                    onAnalysisComplete={(newReport) => {
                        setReport(newReport);
                        setSelectedPacket(null);
                        setLatencyThreshold(null);
                        setStatusFilter("all");
                    }}
                />

                {report ? (
                    <div className="mt-8 space-y-6">

                        <SummaryCards summary={report.summary} />

                        <div className="rounded-lg border border-[#1F2830] bg-[#111827] px-4 py-3 text-sm text-slate-300">

                            Packets with latency ≥

                            <span className="mx-2 font-semibold text-cyan-400">
                                {latencyThreshold}
                            </span>

                            ms

                            <span className="ml-4 text-slate-500">
                                (
                                {filteredPackets.length} matched packets,
                                {" "}
                                {report.packets.length} total packets
                                )
                            </span>

                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                            <div className="lg:col-span-8">

                                <div className="mb-3 flex items-center justify-end gap-2">

                                    <label className="text-sm text-slate-400">
                                        Status
                                    </label>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value as StatusFilter)
                                        }
                                        className="rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-white"
                                    >
                                        <option value="all">All</option>
                                        <option value="normal">Normal</option>
                                        <option value="matched">Matched</option>
                                        <option value="duplicateAck">Duplicate ACK</option>
                                        <option value="retransmission">Retransmission</option>
                                    </select>

                                </div>

                                <PacketTable
                                    packets={filteredPackets}
                                    onSelectPacket={setSelectedPacket}
                                    selectedPacketNumber={selectedPacket?.packetNumber}
                                />

                            </div>

                            <div className="lg:col-span-4">

                                <PacketDetails
                                    packet={selectedPacket}
                                    captureFile={report.captureFile}
                                />

                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                            <LatencyChart
                                packets={filteredPackets}
                            />

                            <StatusPieChart
                                packets={filteredPackets}
                            />

                        </div>

                        <TopLatencyChart
                            packets={filteredPackets}
                        />

                    </div>
                ) : (
                    <div className="mt-12 rounded-xl border border-dashed border-[#1F2830] py-24 text-center">

                        <div className="mb-5 text-5xl">
                            📁
                        </div>

                        <h2 className="mb-2 text-lg font-semibold text-white">
                            No Capture Loaded
                        </h2>

                        <p className="text-slate-500">
                            Upload a PCAP file to begin analyzing TCP ACK latency.
                        </p>

                    </div>
                )}

            </div>
        </div>
    );
}