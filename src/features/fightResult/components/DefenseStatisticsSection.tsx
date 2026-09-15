import type { DamageMitigationStatistics } from "netim2-shared";
import {
    getDamageTypeSegments,
    getStatusEffectDamageSegments
} from "../utils/damage-statistics-segments";
import {
    getPositiveSegments,
    getSegmentsTotal
} from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";
import { StatisticsBar } from "./StatisticsBar";

export interface DefenseStatisticsSectionProps {
    mitigated: DamageMitigationStatistics;
}

export const DefenseStatisticsSection = ({
    mitigated
}: DefenseStatisticsSectionProps) => {
    const damageTypeSegments = getDamageTypeSegments(
        mitigated.byDamageType,
        mitigated.total
    );
    const visibleDamageTypes = getPositiveSegments(
        damageTypeSegments
    );
    const statusEffectSegments = getPositiveSegments(
        getStatusEffectDamageSegments(
            mitigated.byStatusEffect
        )
    );
    const statusEffectTotal = getSegmentsTotal(
        statusEffectSegments
    );

    return (
        <div className="space-y-5">
            <StatisticBlock
                title="Total mitigado"
                label="Daño mitigado total"
                value={mitigated.total}
                segments={damageTypeSegments}
            />

            {visibleDamageTypes.length > 0 && (
                <section>
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Por tipo de daño
                    </h4>
                    <div className="space-y-3">
                        {visibleDamageTypes.map(segment => (
                            <StatisticsBar
                                key={segment.key}
                                label={segment.label}
                                value={segment.value}
                                segments={[segment]}
                                scaleTotal={mitigated.total}
                                showLegend={false}
                                icon={segment.icon}
                            />
                        ))}
                    </div>
                </section>
            )}

            {statusEffectSegments.length > 0 && (
                <section>
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Por status effect
                    </h4>
                    <div className="space-y-3">
                        {statusEffectSegments.map(segment => (
                            <StatisticsBar
                                key={segment.key}
                                label={`${segment.label} mitigado`}
                                value={segment.value}
                                segments={[segment]}
                                scaleTotal={statusEffectTotal}
                                showLegend={false}
                                icon={segment.icon}
                            />
                        ))}
                    </div>
                </section>
            )}

            {mitigated.total <= 0 &&
                statusEffectTotal <= 0 && (
                    <p className="py-3 text-center text-xs text-slate-500">
                        No se registró daño mitigado.
                    </p>
                )}
        </div>
    );
};
