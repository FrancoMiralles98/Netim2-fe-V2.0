import type { DamageDealStatistics } from "netim2-shared";
import {
    getDamageDeliverySegments,
    getDamageSourceSegments,
    getDamageTypeSegments,
    getSkillDamageSegments,
    getStatusEffectDamageSegments
} from "../utils/damage-statistics-segments";
import { getSegmentsTotal } from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";

export interface DamageStatisticsSectionProps {
    dealt: DamageDealStatistics;
}

export const DamageStatisticsSection = ({
    dealt
}: DamageStatisticsSectionProps) => {
    const damageTypeSegments = getDamageTypeSegments(
        dealt.byDamageType,
        dealt.total
    );
    const deliverySegments = getDamageDeliverySegments(
        dealt.byDelivery
    );
    const sourceSegments = getDamageSourceSegments(
        dealt.bySource
    );
    const skillSegments = getSkillDamageSegments(
        dealt.bySkill
    );
    const statusEffectSegments = getStatusEffectDamageSegments(
        dealt.byStatusEffect
    );

    return (
        <div className="space-y-5">
            <StatisticBlock
                title="Total infligido"
                label="Daño total"
                value={dealt.total}
                segments={damageTypeSegments}
            />

            <StatisticBlock
                title="Delivery"
                label="Forma de entrega"
                value={getSegmentsTotal(deliverySegments)}
                segments={deliverySegments}
            />

            <StatisticBlock
                title="Sources"
                label="Fuentes de daño"
                value={getSegmentsTotal(sourceSegments)}
                segments={sourceSegments}
            />

            <StatisticBlock
                title="Skills"
                label="Daño de habilidades"
                value={getSegmentsTotal(skillSegments)}
                segments={skillSegments}
            />

            <StatisticBlock
                title="Status effects"
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
