import type { HealingStatistics } from "netim2-shared";
import {
    getHealingSourceSegments,
    getPreventedHealingSegments,
    getSkillHealingSegments
} from "../utils/healing-statistics-segments";
import {
    getPositiveSegments,
    getSegmentsTotal
} from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";
import type { FighterFightSummarySkill } from "../types/fighter-fight-summary.types";

export interface HealingStatisticsSectionProps {
    healing: HealingStatistics;
    skills: FighterFightSummarySkill[];
}

export const HealingStatisticsSection = ({
    healing,
    skills
}: HealingStatisticsSectionProps) => {
    const sourceSegments = getPositiveSegments(
        getHealingSourceSegments(healing)
    );
    const skillSegments = getPositiveSegments(
        getSkillHealingSegments(healing, skills)
    );
    const preventedSegments = getPositiveSegments(
        getPreventedHealingSegments(healing)
    );
    const totalHealing = getSegmentsTotal(sourceSegments);

    return (
        <div className="space-y-5">
            <StatisticBlock
                title="Curación efectiva"
                label="Vida recuperada"
                value={totalHealing}
                segments={sourceSegments}
            />

            <StatisticBlock
                title="Skills"
                label="Curación de habilidades"
                value={getSegmentsTotal(skillSegments)}
                segments={skillSegments}
            />

            <StatisticBlock
                title="Reducción de curación"
                label="Curación impedida al enemigo"
                value={healing.prevented}
                segments={preventedSegments}
            />

            {totalHealing <= 0 && healing.prevented <= 0 && (
                <p className="py-3 text-center text-xs text-slate-500">
                    No se registraron curaciones.
                </p>
            )}
        </div>
    );
};
