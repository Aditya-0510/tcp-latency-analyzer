import { TooltipProps } from "recharts";

// Recharts' default tooltip renders a plain white box with inline styles
// that don't pick up Tailwind classes — this replaces it entirely so
// tooltips match the console theme.
export default function ChartToolTip({
    active,
    payload,
    label,
    unit = "",
}: TooltipProps<number, string> & { unit?: string }) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="rounded-md border border-[#2A3540] bg-[#161D26] px-3 py-2 shadow-lg">
            {label !== undefined && (
                <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-[#5B6774]">
                    Packet {label}
                </div>
            )}

            <div className="space-y-0.5">
                {payload.map((entry, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 font-mono text-xs"
                    >
                        <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-[#8FA3AE]">
                            {entry.name}:
                        </span>
                        <span
                            className="text-[#E7EDF3]"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {entry.value}
                            {unit}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}