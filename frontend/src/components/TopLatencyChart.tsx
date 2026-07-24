import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import { Packet } from "../types/report";
import ChartTooltip from "./ChartToolTip";

interface Props {
    packets: Packet[];
}

const AXIS_STYLE = { fontSize: 11, fill: "#5B6774" };

export default function TopLatencyChart({ packets }: Props) {
    const data = [...packets]
        .filter((p) => p.matched)
        .sort((a, b) => b.latency - a.latency)
        .slice(0, 10)
        .map((p) => ({
            packet: p.packetNumber,
            latency: Number(p.latency.toFixed(3)),
        }));

    return (
        <div className="rounded-lg border border-[#1F2830] bg-[#10161D] p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8FA3AE]">
                Top 10 Highest ACK Latencies
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1F2830"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="packet"
                        tick={AXIS_STYLE}
                        axisLine={{ stroke: "#1F2830" }}
                        tickLine={{ stroke: "#1F2830" }}
                    />

                    <YAxis
                        unit=" ms"
                        tick={AXIS_STYLE}
                        axisLine={{ stroke: "#1F2830" }}
                        tickLine={{ stroke: "#1F2830" }}
                        width={64}
                    />

                    <Tooltip
                        cursor={{ fill: "#161D26" }}
                        content={<ChartTooltip unit=" ms" />}
                    />

                    <Bar
                        dataKey="latency"
                        fill="#22D3C9"
                        radius={[3, 3, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}