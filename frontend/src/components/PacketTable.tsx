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
}

interface PacketTableProps {
    packets: Packet[];
    onSelectPacket: (packet: Packet) => void;
}

export default function PacketTable({
    packets,
    onSelectPacket,
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

    return (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <TableToolbar table={table} />

            <div className="overflow-x-auto">

                <table className="min-w-full border-collapse">

                    <thead className="sticky top-0 bg-slate-100">

                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>

                                {headerGroup.headers.map((header) => (

                                    <th
                                        key={header.id}
                                        className="cursor-pointer border-b px-4 py-3 text-left text-sm font-semibold select-none"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-1">

                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            {{
                                                asc: "▲",
                                                desc: "▼",
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? ""}

                                        </div>
                                    </th>

                                ))}

                            </tr>
                        ))}

                    </thead>

                    <tbody>

                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-10 text-center text-slate-500"
                                >
                                    No packets found.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (

                                <tr
                                    key={row.id}
                                    onClick={() => onSelectPacket(row.original)}
                                    className="cursor-pointer border-b transition hover:bg-blue-50"
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

                            ))
                        )}

                    </tbody>

                </table>

            </div>

            <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">

                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Previous
                </button>

                <div className="text-sm">

                    Page{" "}
                    <strong>
                        {table.getState().pagination.pageIndex + 1}
                    </strong>{" "}
                    of{" "}
                    <strong>{table.getPageCount()}</strong>

                </div>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                </button>

            </div>

        </div>
    );
}