interface SummaryCardProps {
    title: string;
    value: string | number;
    unit?: string;
    accent?: "default" | "danger" | "warning" | "success";
}

const ACCENT_MAP: Record<
    NonNullable<SummaryCardProps["accent"]>,
    string
> = {
    default: "#E7EDF3",
    danger: "#F0616D",
    warning: "#F5A93F",
    success: "#34D399",
};

export default function SummaryCard({
    title,
    value,
    unit,
    accent = "default",
}: SummaryCardProps) {
    return (
        <div className="rounded-lg border border-[#1F2830] bg-[#10161D] p-5 transition-colors hover:border-[#2A3540]">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#5B6774]">
                {title}
            </h3>

            <div className="mt-2.5 flex items-end gap-1.5">
                <span
                    className="font-mono text-2xl font-semibold tabular-nums"
                    style={{ color: ACCENT_MAP[accent] }}
                >
                    {value}
                </span>

                {unit && (
                    <span className="mb-0.5 font-mono text-xs text-[#5B6774]">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}