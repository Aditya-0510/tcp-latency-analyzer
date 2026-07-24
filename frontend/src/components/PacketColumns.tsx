import { ColumnDef } from "@tanstack/react-table";
import { Packet } from "../types/report";
import StatusBadge from "./StatusBadge";

function FlagChip({ flag }: { flag: string }) {
    return (
        <span className="rounded border border-[#1F2830] bg-[#161D26] px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-[#8FA3AE]">
            {flag}
        </span>
    );
}

function getFlags(row: Packet) {
    const flags: string[] = [];
    if (row.syn) flags.push("SYN");
    if (row.ack) flags.push("ACK");
    if (row.psh) flags.push("PSH");
    if (row.fin) flags.push("FIN");
    if (row.rst) flags.push("RST");
    if (row.urg) flags.push("URG");
    return flags;
}

export const columns: ColumnDef<Packet>[] = [
    {
        accessorKey: "packetNumber",
        header: "Packet",
        cell: ({ getValue }) => (
            <span className="font-mono text-sm tabular-nums text-[#5B6774]">
                {getValue<number>()}
            </span>
        ),
    },

    {
        id: "source",
        header: "Source",
        accessorFn: (row) => `${row.srcIp} ${row.srcPort}`,
        cell: ({ row }) => (
            <div className="font-mono text-sm tabular-nums">
                <div className="text-[#E7EDF3]">{row.original.srcIp}</div>
                <div className="text-xs text-[#5B6774]">
                    :{row.original.srcPort}
                </div>
            </div>
        ),
    },

    {
        id: "destination",
        header: "Destination",
        accessorFn: (row) => `${row.dstIp} ${row.dstPort}`,
        cell: ({ row }) => (
            <div className="font-mono text-sm tabular-nums">
                <div className="text-[#E7EDF3]">{row.original.dstIp}</div>
                <div className="text-xs text-[#5B6774]">
                    :{row.original.dstPort}
                </div>
            </div>
        ),
    },

    // {
    //     accessorKey: "sequenceNumber",
    //     header: "Sequence",
    //     cell: ({ getValue }) => (
    //         <span className="font-mono text-sm tabular-nums text-[#8FA3AE]">
    //             {getValue<number>()}
    //         </span>
    //     ),
    // },

    // {
    //     accessorKey: "acknowledgementNumber",
    //     header: "Acknowledgement",
    //     cell: ({ getValue }) => (
    //         <span className="font-mono text-sm tabular-nums text-[#8FA3AE]">
    //             {getValue<number>()}
    //         </span>
    //     ),
    // },

    {
        accessorKey: "payloadLength",
        header: "Payload",
        cell: ({ getValue }) => (
            <span className="font-mono text-sm tabular-nums text-[#8FA3AE]">
                {getValue<number>()}
                <span className="ml-1 text-[#5B6774]">B</span>
            </span>
        ),
    },

    {
        id: "flags",
        header: "Flags",
        accessorFn: (row) => getFlags(row).join(" "),
        cell: ({ row }) => {
            const flags = getFlags(row.original);
            return (
                <div className="flex flex-wrap gap-1">
                    {flags.map((flag) => (
                        <FlagChip key={flag} flag={flag} />
                    ))}
                </div>
            );
        },
    },

    {
        id: "latency",
        header: "Latency",
        accessorFn: (row) => (row.matched ? row.latency : -1),
        cell: ({ row }) =>
            row.original.matched ? (
                <span className="font-mono text-sm tabular-nums text-[#E7EDF3]">
                    {row.original.latency.toFixed(3)}
                    <span className="ml-1 text-[#5B6774]">ms</span>
                </span>
            ) : (
                <span className="font-mono text-sm text-[#3A4551]">—</span>
            ),
    },

    {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
            <StatusBadge
                matched={row.original.matched}
                retransmission={row.original.retransmission}
                duplicateAck={row.original.duplicateAck}
            />
        ),
    },
];