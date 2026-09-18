import type { FighterCombatStatisticsState } from "netim2-shared";
import { ActionStatisticsSection } from "./ActionStatisticsSection";
import { DamageStatisticsSection } from "./DamageStatisticsSection";
import { DefenseStatisticsSection } from "./DefenseStatisticsSection";
import { EffectStatisticsSection } from "./EffectStatisticsSection";
import { HealingStatisticsSection } from "./HealingStatisticsSection";
import { HitStatisticsSection } from "./HitStatisticsSection";
import { StatisticsAccordion } from "./StatisticsAccordion";

export interface FighterStatisticsProps {
    statistics: FighterCombatStatisticsState;
}

export const FighterStatistics = ({
    statistics
}: FighterStatisticsProps) => (
    <div className="mt-4 space-y-2">
        <StatisticsAccordion title="Daño" defaultOpen>
            <DamageStatisticsSection
                dealt={statistics.damage.dealt}
            />
        </StatisticsAccordion>

        <StatisticsAccordion title="Defensa">
            <DefenseStatisticsSection
                mitigated={statistics.damage.mitigated}
            />
        </StatisticsAccordion>

        <StatisticsAccordion title="Hits">
            <HitStatisticsSection
                hits={statistics.hits}
            />
        </StatisticsAccordion>

        <StatisticsAccordion title="Curaciones">
            <HealingStatisticsSection
                healing={statistics.healing}
            />
        </StatisticsAccordion>

        <StatisticsAccordion title="Acciones">
            <ActionStatisticsSection
                actions={statistics.actions}
            />
        </StatisticsAccordion>

        <StatisticsAccordion title="Efectos">
            <EffectStatisticsSection
                effects={statistics.effects}
            />
        </StatisticsAccordion>
    </div>
);
