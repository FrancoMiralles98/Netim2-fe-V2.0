import type { StatisticsBarSegmentLayout } from "../types/statistics-bar.types";
import { formatStatisticValue } from "../utils/statistics-bar.utils";

export interface StatisticsBarSegmentProps {
    segment: StatisticsBarSegmentLayout;
}

export const StatisticsBarSegment = ({
    segment
}: StatisticsBarSegmentProps) => (
    <div
        className={`
            h-full
            min-w-px
            transition-[width]
            duration-300
            ease-out
            ${segment.colorClass}
        `}
        style={{ width: `${segment.percentage}%` }}
        title={`${segment.label}: ${formatStatisticValue(segment.value)} (${segment.percentage.toFixed(1)}%)`}
    />
);
