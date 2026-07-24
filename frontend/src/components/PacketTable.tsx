import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import { useState } from "react";

import { Packet } from "../types/report";
import { columns } from "./PacketColumns";
import TableToolbar from "./TableToolBar";

interface PacketTableProps {
    packets: Packet[];
    onSelectPacket?: (packet: Packet) => void;
    selectedPacketNumber?: number;
}
export default function PacketTable({
    packets,
    onSelectPacket,
    selectedPacketNumber,
}: PacketTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: packets,
        columns,

        state: {
            sorting,
            globalFilter,
        },

        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const rows = table.getRowModel().rows;
    const { pageIndex, pageSize } = table.getState().pagination;
    const total = table.getFilteredRowModel().rows.length;
    const rangeStart = total === 0 ? 0 : pageIndex * pageSize + 1;
    const rangeEnd = Math.min(total, (pageIndex + 1) * pageSize);

    return (
        <div className="overflow-hidden rounded-lg border border-[#1F2830] bg-[#10161D]">
            <TableToolbar table={table} />

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="sticky top-0 z-10 bg-[#10161D]/95 backdrop-blur">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="cursor-pointer select-none border-b border-[#1F2830] px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-[#5B6774] transition-colors hover:text-[#8FA3AE]"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            <span className="text-[#22D3C9]">
                                                {{
                                                    asc: "↑",
                                                    desc: "↓",
                                                }[
                                                    header.column.getIsSorted() as string
                                                ] ?? ""}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-16 text-center text-sm text-[#5B6774]"
                                >
                                    No packets match your filters.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => {
                                const packet = row.original;

                                const isSelected =
                                    selectedPacketNumber === packet.packetNumber;

                                return (
                                    <tr
                                        key={row.id}
                                        onClick={() => onSelectPacket?.(packet)}
                                        className={`cursor-pointer border-b border-[#161D26] transition-colors ${
                                            isSelected
                                                ? "bg-[#22D3C9]/10 border-l-2 border-l-[#22D3C9]"
                                                : "border-l-2 border-l-transparent hover:bg-[#161D26]/60"
                                        }`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-4 py-3 text-sm"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#1F2830] px-5 py-3.5">
                <div className="font-mono text-xs tabular-nums text-[#5B6774]">
                    {rangeStart}–{rangeEnd} of {total}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-md border border-[#1F2830] px-3 py-1.5 text-xs font-medium text-[#8FA3AE] transition-colors hover:border-[#2A3540] hover:text-[#E7EDF3] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Previous
                    </button>

                    <div className="px-2 font-mono text-xs tabular-nums text-[#5B6774]">
                        {table.getState().pagination.pageIndex + 1} /{" "}
                        {table.getPageCount() || 1}
                    </div>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-md border border-[#1F2830] px-3 py-1.5 text-xs font-medium text-[#8FA3AE] transition-colors hover:border-[#2A3540] hover:text-[#E7EDF3] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}