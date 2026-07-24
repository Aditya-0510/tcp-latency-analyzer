import { Table } from "@tanstack/react-table";
import { Packet } from "../types/report";

interface TableToolbarProps {
    table: Table<Packet>;
}

export default function TableToolbar({
    table,
}: TableToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F2830] px-5 py-3.5">
            <div className="relative w-72">
                <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6774]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                </svg>

                <input
                    type="text"
                    placeholder="Search IP, packet…"
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(e) =>
                        table.setGlobalFilter(e.target.value)
                    }
                    className="w-full rounded-md border border-[#1F2830] bg-[#0A0E13] py-2 pl-9 pr-3 text-sm text-[#E7EDF3] placeholder:text-[#5B6774] outline-none transition-colors focus:border-[#22D3C9]/60"
                />
            </div>

            <div className="flex items-center gap-2.5">
                <label className="text-xs text-[#5B6774]">
                    Rows per page
                </label>

                <select
                    className="rounded-md border border-[#1F2830] bg-[#0A0E13] px-2.5 py-1.5 text-sm text-[#E7EDF3] outline-none transition-colors focus:border-[#22D3C9]/60"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) =>
                        table.setPageSize(Number(e.target.value))
                    }
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </div>
    );
}