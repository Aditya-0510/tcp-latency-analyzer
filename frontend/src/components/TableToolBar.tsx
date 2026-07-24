import { Table } from "@tanstack/react-table";
import { Packet } from "../types/report";

interface TableToolbarProps {
    table: Table<Packet>;
}

export default function TableToolbar({
    table,
}: TableToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-slate-50 p-4">

            <input
                type="text"
                placeholder="Search IP, Packet..."
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(e) =>
                    table.setGlobalFilter(e.target.value)
                }
                className="w-72 rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />

            <div className="flex items-center gap-3">

                <label className="text-sm">
                    Rows:
                </label>

                <select
                    className="rounded border px-2 py-2"
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