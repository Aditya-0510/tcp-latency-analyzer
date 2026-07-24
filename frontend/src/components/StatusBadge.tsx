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
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F0616D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F0616D]" />
                Retransmission
            </span>
        );
    }

    if (duplicateAck) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F5A93F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F5A93F]" />
                Duplicate ACK
            </span>
        );
    }

    if (matched) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34D399]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                Matched
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B6774]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3A4551]" />
            Normal
        </span>
    );
}