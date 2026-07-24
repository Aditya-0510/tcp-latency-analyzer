interface SummaryCardProps {
    title: string;
    value: string | number;
    unit?: string;
}

export default function SummaryCard({
    title,
    value,
    unit,
}: SummaryCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500">
                {title}
            </h3>

            <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold text-slate-900">
                    {value}
                </span>

                {unit && (
                    <span className="mb-1 text-sm text-slate-500">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}