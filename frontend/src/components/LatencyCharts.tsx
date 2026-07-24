import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import { Packet } from "../../types/report";

interface Props {
    packets: Packet[];
}

export default function LatencyChart({
    packets,
}: Props) {

    const data = packets
        .filter((p) => p.matched)
        .map((p) => ({
            packet: p.packetNumber,
            latency: p.latency,
        }));

    return (
        <div className="rounded-xl border bg-white p-6 shadow">

            <h2 className="mb-4 text-lg font-semibold">
                ACK Latency
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="packet" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        dataKey="latency"
                        type="monotone"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}