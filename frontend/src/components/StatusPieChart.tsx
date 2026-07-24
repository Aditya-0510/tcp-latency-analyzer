import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

import { Packet } from "../types/report";

interface Props {
    packets: Packet[];
}

// Matches StatusBadge: success, danger, warning, neutral.
const COLORS = ["#34D399", "#F0616D", "#F5A93F", "#3A4551"];

const RADIAN = Math.PI / 180;

function renderLabel({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}) {
    if (percent === 0) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 1.15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#8FA3AE"
            fontSize={11}
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

function PieTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { name: string; value: number; payload: { fill: string } }[];
}) {
    if (!active || !payload || payload.length === 0) return null;
    const entry = payload[0];

    return (
        <div className="rounded-md border border-[#2A3540] bg-[#161D26] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 font-mono text-xs">
                <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.payload.fill }}
                />
                <span className="text-[#8FA3AE]">{entry.name}:</span>
                <span
                    className="text-[#E7EDF3]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {entry.value}
                </span>
            </div>
        </div>
    );
}

export default function StatusPieChart({ packets }: Props) {
    const matched = packets.filter((p) => p.matched).length;
    const retrans = packets.filter((p) => p.retransmission).length;
    const dupAck = packets.filter((p) => p.duplicateAck).length;

    const normal = packets.length - matched - retrans - dupAck;

    const data = [
        { name: "Matched", value: matched },
        { name: "Retransmission", value: retrans },
        { name: "Duplicate ACK", value: dupAck },
        { name: "Normal", value: normal },
    ];

    return (
        <div className="rounded-lg border border-[#1F2830] bg-[#10161D] p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8FA3AE]">
                Packet Status Distribution
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label={renderLabel}
                        labelLine={{ stroke: "#5B6774" }}
                        stroke="#10161D"
                        strokeWidth={2}
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                        ))}
                    </Pie>

                    <Tooltip content={<PieTooltip />} />

                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                            <span className="text-xs text-[#8FA3AE]">
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}