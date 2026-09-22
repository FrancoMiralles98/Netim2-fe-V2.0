import type { EffectStatistics } from "netim2-shared";
import { getEffectCountSegments } from "../utils/effect-statistics-segments";
import {
    getPositiveSegments,
    getSegmentsTotal
} from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";

export interface EffectStatisticsSectionProps {
    effects: EffectStatistics;
}

export const EffectStatisticsSection = ({
    effects
}: EffectStatisticsSectionProps) => {
    const appliedSegments = getPositiveSegments(
        getEffectCountSegments(effects.appliedByType)
    );
    const receivedSegments = getPositiveSegments(
        getEffectCountSegments(effects.receivedByType)
    );
    const resistedSegments = getPositiveSegments(
        getEffectCountSegments(effects.resistedByType)
    );

    const appliedTotal = getSegmentsTotal(appliedSegments);
    const receivedTotal = getSegmentsTotal(receivedSegments);
    const resistedTotal = getSegmentsTotal(resistedSegments);

    return (
        <div className="space-y-5">
            <StatisticBlock
                title="Efectos aplicados"
                label="Aplicados"
                value={appliedTotal}
                segments={appliedSegments}
            />

            <StatisticBlock
                title="Efectos recibidos"
                label="Recibidos"
                value={receivedTotal}
                segments={receivedSegments}
            />

            <StatisticBlock
                title="Efectos resistidos"
                label="Resistidos"
                value={resistedTotal}
                segments={resistedSegments}
            />

            {appliedTotal <= 0 &&
                receivedTotal <= 0 &&
                resistedTotal <= 0 && (
                    <p className="py-3 text-center text-xs text-slate-500">
                        No se registraron efectos de estado.
                    </p>
                )}
        </div>
    );
};
