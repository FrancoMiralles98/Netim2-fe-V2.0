import type { StatisticsBarSegment as StatisticsBarSegmentData } from "../types/statistics-bar.types";
import {
    formatStatisticValue,
    getStatisticsBarLayout
} from "../utils/statistics-bar.utils";
import { StatisticsBarSegment } from "./StatisticsBarSegment";

export interface StatisticsBarProps {
    label: string;
    value: number;
    segments: StatisticsBarSegmentData[];
    scaleTotal?: number;
    showLegend?: boolean;
    icon?: string;
}

export const StatisticsBar = ({
    label,
    value,
    segments,
    scaleTotal,
    showLegend = true,
    icon
}: StatisticsBarProps) => {
    const layout = getStatisticsBarLayout(
        value,
        segments,
        scaleTotal
    );

    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-400">
                    {icon && (
                        <img
                            src={icon}
                            alt=""
                            className="h-4 w-4 shrink-0 object-contain"
                        />
                    )}
                    <span className="truncate">{label}</span>
                </span>
                <span className="text-sm font-bold tabular-nums text-slate-100">
                    {formatStatisticValue(value)}
                </span>
            </div>

            <div
                className="flex h-2.5 overflow-hidden rounded-full bg-slate-800"
                aria-label={`${label}: ${formatStatisticValue(value)}`}
            >
                {layout.map(segment => (
                    <StatisticsBarSegment
                        key={segment.key}
                        segment={segment}
                    />
                ))}
            </div>

            {showLegend && layout.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {layout.map(segment => (
                        <div
                            key={segment.key}
                            className="flex min-w-0 items-center gap-1.5 text-[10px]"
                        >
                            {segment.icon ? (
                                <img
                                    src={segment.icon}
                                    alt=""
                                    className="h-3.5 w-3.5 shrink-0 object-contain"
                                />
                            ) : (
                                <span
                                    className={`h-2 w-2 shrink-0 rounded-full ${segment.colorClass}`}
                                />
                            )}

                            <span
                                className={`truncate ${segment.textColorClass ?? 'text-slate-400'}`}
                            >
                                {segment.label}
                            </span>
                            <span className="ml-auto tabular-nums text-slate-200">
                                {formatStatisticValue(segment.value)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
