import type { DamageDealStatistics } from "netim2-shared";
import {
    getDamageSourceSegments,
    getDamageTypeSegments,
    getSkillDamageSegments,
    getStatusEffectDamageSegments
} from "../utils/damage-statistics-segments";
import { getSegmentsTotal } from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";
import type { FighterFightSummarySkill } from "../types/fighter-fight-summary.types";

export interface DamageStatisticsSectionProps {
    dealt: DamageDealStatistics;
    skills: FighterFightSummarySkill[];
}

export const DamageStatisticsSection = ({
    dealt,
    skills
}: DamageStatisticsSectionProps) => {
    const damageTypeSegments = getDamageTypeSegments(
        dealt.byDamageType,
        dealt.total,
        dealt.byDelivery.periodic
    );
    const sourceSegments = getDamageSourceSegments(
        dealt.bySource
    );
    const skillSegments = getSkillDamageSegments(
        dealt.bySkill,
        skills
    );
    const statusEffectSegments = getStatusEffectDamageSegments(
        dealt.byStatusEffect
    );

    return (
        <div className="space-y-5">
            <StatisticBlock
                title=""
                label="Daño total"
                value={dealt.total}
                segments={damageTypeSegments}
            />

            <StatisticBlock
                title=""
                label="Fuentes de daño"
                value={getSegmentsTotal(sourceSegments)}
                segments={sourceSegments}
            />

            <StatisticBlock
                title=""
                label="Daño de habilidades"
                value={getSegmentsTotal(skillSegments)}
                segments={skillSegments}
            />

            <StatisticBlock
                title=""
                label="Daño de estados"
                value={getSegmentsTotal(statusEffectSegments)}
                segments={statusEffectSegments}
            />

            {dealt.total <= 0 && (
                <p className="py-3 text-center text-xs text-slate-500">
                    No se registró daño infligido.
                </p>
            )}
        </div>
    );
};
