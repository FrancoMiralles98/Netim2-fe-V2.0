import type { HitStatistics } from "netim2-shared";
import {
    getDefensiveHitSegments,
    getOffensiveHitResultSegments,
    getSpecialHitSegments
} from "../utils/hit-statistics-segments";
import {
    getPositiveSegments,
    getSegmentsTotal
} from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";
import { StatisticsBar } from "./StatisticsBar";

export interface HitStatisticsSectionProps {
    hits: HitStatistics;
}

export const HitStatisticsSection = ({
    hits
}: HitStatisticsSectionProps) => {
    const offensiveSegments = getOffensiveHitResultSegments(hits);
    const specialSegments = getPositiveSegments(
        getSpecialHitSegments(hits)
    );
    const defensiveSegments = getPositiveSegments(
        getDefensiveHitSegments(hits)
    );
    const defensiveTotal = getSegmentsTotal(defensiveSegments);

    return (
        <div className="space-y-5">
            <StatisticBlock
                title="Resultados ofensivos"
                label="Golpes intentados"
                value={hits.attempted}
                segments={offensiveSegments}
            />

            {specialSegments.length > 0 && (
                <section>
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Golpes especiales
                    </h4>
                    <div className="space-y-3">
                        {specialSegments.map(segment => (
                            <StatisticsBar
                                key={segment.key}
                                label={segment.label}
                                value={segment.value}
                                segments={[segment]}
                                scaleTotal={
                                    segment.key === 'doubleHitsTriggered'
                                        ? hits.attempted
                                        : hits.successful
                                }
                                showLegend={false}
                                icon={segment.icon}
                            />
                        ))}
                    </div>
                </section>
            )}

            <StatisticBlock
                title="Resultados defensivos"
                label="Defensas activadas"
                value={defensiveTotal}
                segments={defensiveSegments}
            />

            {hits.attempted <= 0 &&
                specialSegments.length === 0 &&
                defensiveTotal <= 0 && (
                    <p className="py-3 text-center text-xs text-slate-500">
                        No se registraron golpes.
                    </p>
                )}
        </div>
    );
};
