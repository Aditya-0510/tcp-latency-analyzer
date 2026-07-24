import { Packet } from "../types/report";
import StatusBadge from "./StatusBadge";

interface Props {
    packet: Packet | null;
}

export default function PacketDetails({ packet }: Props) {
    if (!packet) {
        return (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#1F2830] bg-[#10161D] p-8 text-center">
                <div className="mb-3 h-8 w-8 rounded-full border border-dashed border-[#2A3540]" />
                <p className="text-sm text-[#5B6774]">
                    Select a row to inspect its packet detail.
                </p>
            </div>
        );
    }

    const flags: string[] = [];
    if (packet.syn) flags.push("SYN");
    if (packet.ack) flags.push("ACK");
    if (packet.psh) flags.push("PSH");
    if (packet.fin) flags.push("FIN");
    if (packet.rst) flags.push("RST");
    if (packet.urg) flags.push("URG");

    return (
        <div className="rounded-lg border border-[#1F2830] bg-[#10161D] p-6">
            <div className="mb-5 flex items-center justify-between border-b border-[#1F2830] pb-4">
                <h2 className="font-mono text-lg font-semibold tabular-nums text-[#E7EDF3]">
                    Packet #{packet.packetNumber}
                </h2>
                <StatusBadge
                    matched={packet.matched}
                    retransmission={packet.retransmission}
                    duplicateAck={packet.duplicateAck}
                />
            </div>

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
                    {flags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {flags.map((flag) => (
                                <span
                                    key={flag}
                                    className="rounded border border-[#1F2830] bg-[#161D26] px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-[#8FA3AE]"
                                >
                                    {flag}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-[#3A4551]">—</span>
                    )}
                </Info>

                <Info label="Latency">
                    {packet.matched
                        ? `${packet.latency.toFixed(3)} ms`
                        : "—"}
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
        <div className="flex items-center justify-between gap-4">
            <div className="text-xs uppercase tracking-[0.06em] text-[#5B6774]">
                {label}
            </div>
            <div className="font-mono text-sm tabular-nums text-[#E7EDF3]">
                {children}
            </div>
        </div>
    );
}