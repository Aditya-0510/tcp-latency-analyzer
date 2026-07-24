import { ColumnDef } from "@tanstack/react-table";
import { Packet } from "../types/report";
import StatusBadge from "./StatusBadge";

export const columns: ColumnDef<Packet>[] = [
    {
        accessorKey: "packetNumber",
        header: "Packet",
        cell: ({ getValue }) => (
            <span className="font-medium">{getValue<number>()}</span>
        ),
    },

    {
        id: "source",
        header: "Source",

        accessorFn: (row) => `${row.srcIp} ${row.srcPort}`,

        cell: ({ row }) => (
            <div>
                <div>{row.original.srcIp}</div>
                <div className="text-xs text-slate-500">
                    {row.original.srcPort}
                </div>
            </div>
        ),
    },

    {
        id: "destination",
        header: "Destination",

        accessorFn: (row) => `${row.dstIp} ${row.dstPort}`,

        cell: ({ row }) => (
            <div>
                <div>{row.original.dstIp}</div>
                <div className="text-xs text-slate-500">
                    {row.original.dstPort}
                </div>
            </div>
        ),
    },

    {
        accessorKey: "sequenceNumber",
        header: "Sequence",
    },

    {
        accessorKey: "acknowledgementNumber",
        header: "Acknowledgement",
    },

    {
        accessorKey: "payloadLength",
        header: "Payload",
    },

    {
        id: "flags",

        header: "Flags",

        accessorFn: (row) => {
            const flags = [];

            if (row.syn) flags.push("SYN");
            if (row.ack) flags.push("ACK");
            if (row.psh) flags.push("PSH");
            if (row.fin) flags.push("FIN");
            if (row.rst) flags.push("RST");
            if (row.urg) flags.push("URG");

            return flags.join(" ");
        },

        cell: ({ row }) => {
            const flags = [];

            if (row.original.syn) flags.push("SYN");
            if (row.original.ack) flags.push("ACK");
            if (row.original.psh) flags.push("PSH");
            if (row.original.fin) flags.push("FIN");
            if (row.original.rst) flags.push("RST");
            if (row.original.urg) flags.push("URG");

            return (
                <div className="flex flex-wrap gap-1">
                    {flags.map((flag) => (
                        <span
                            key={flag}
                            className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                        >
                            {flag}
                        </span>
                    ))}
                </div>
            );
        },
    },

    {
        id: "latency",

        header: "Latency",

        accessorFn: (row) =>
            row.matched ? row.latency : -1,

        cell: ({ row }) =>
            row.original.matched ? (
                <span className="font-medium text-green-600">
                    {row.original.latency.toFixed(3)} ms
                </span>
            ) : (
                <span className="text-slate-400">—</span>
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