import { Packet } from "../types/report";
import StatusBadge from "./StatusBadge";

interface Props {
    packet: Packet | null;
}

export default function PacketDetails({ packet }: Props) {
    if (!packet) {
        return (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Packet Details
                </h2>

                <p className="text-slate-500">
                    Select a packet to view its details.
                </p>
            </div>
        );
    }

    const flags = [];

    if (packet.syn) flags.push("SYN");
    if (packet.ack) flags.push("ACK");
    if (packet.psh) flags.push("PSH");
    if (packet.fin) flags.push("FIN");
    if (packet.rst) flags.push("RST");
    if (packet.urg) flags.push("URG");

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold">
                Packet #{packet.packetNumber}
            </h2>

            <div className="space-y-4">

                <Info label="Source">
                    {packet.srcIp}:{packet.srcPort}
                </Info>

                <Info label="Destination">
                    {packet.dstIp}:{packet.dstPort}
                </Info>

                <Info label="Sequence Number">
                    {packet.sequenceNumber}
                </Info>

                <Info label="Acknowledgement Number">
                    {packet.acknowledgementNumber}
                </Info>

                <Info label="Payload">
                    {packet.payloadLength} bytes
                </Info>

                <Info label="Flags">
                    {flags.join(" ")}
                </Info>

                <Info label="Latency">
                    {packet.matched
                        ? `${packet.latency.toFixed(3)} ms`
                        : "—"}
                </Info>

                <Info label="Status">
                    <StatusBadge
                        matched={packet.matched}
                        retransmission={packet.retransmission}
                        duplicateAck={packet.duplicateAck}
                    />
                </Info>

            </div>

        </div>
    );
}

function Info({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="text-sm font-medium text-slate-500">
                {label}
            </div>

            <div className="mt-1">
                {children}
            </div>
        </div>
    );
}