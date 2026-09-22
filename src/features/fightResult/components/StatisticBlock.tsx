import type { StatisticsBarSegment } from "../types/statistics-bar.types";
import { StatisticsBar } from "./StatisticsBar";

export interface StatisticBlockProps {
    title: string;
    label: string;
    value: number;
    segments: StatisticsBarSegment[];
}

export const StatisticBlock = ({
    title,
    label,
    value,
    segments
}: StatisticBlockProps) => {
    if (value <= 0) {
        return null;
    }

    return (
        <section>
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {title}
            </h4>
            <StatisticsBar
                label={label}
                value={value}
                segments={segments}
            />
        </section>
    );
};
