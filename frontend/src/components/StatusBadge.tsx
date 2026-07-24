interface StatusBadgeProps {
    matched: boolean;
    retransmission: boolean;
    duplicateAck: boolean;
}

export default function StatusBadge({
    matched,
    retransmission,
    duplicateAck,
}: StatusBadgeProps) {
    if (retransmission) {
        return (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                🔴 Retransmission
            </span>
        );
    }

    if (duplicateAck) {
        return (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                🟡 Duplicate ACK
            </span>
        );
    }

    if (matched) {
        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                🟢 Matched
            </span>
        );
    }

    return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Normal
        </span>
    );
}