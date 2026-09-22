import type { FighterCombatStatisticsState } from "netim2-shared";
import { ActionStatisticsSection } from "./ActionStatisticsSection";
import { DamageStatisticsSection } from "./DamageStatisticsSection";
import { DefenseStatisticsSection } from "./DefenseStatisticsSection";
import { EffectStatisticsSection } from "./EffectStatisticsSection";
import { HealingStatisticsSection } from "./HealingStatisticsSection";
import { HitStatisticsSection } from "./HitStatisticsSection";
import { ResourceStatisticsSection } from "./ResourceStatisticsSection";
import { StatisticsAccordion } from "./StatisticsAccordion";
import type { FighterFightSummarySkill } from "../types/fighter-fight-summary.types";

export interface FighterStatisticsProps {
    statistics: FighterCombatStatisticsState;
    skills: FighterFightSummarySkill[];
}

export const FighterStatistics = ({
    statistics,
    skills
}: FighterStatisticsProps) => (
    <div className="mt-4 space-y-2">
        <StatisticsAccordion title="Daño" defaultOpen>
            <DamageStatisticsSection
                dealt={statistics.damage.dealt}
                skills={skills}
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
                skills={skills}
            />
        </StatisticsAccordion>

        <StatisticsAccordion title="Recursos">
            <ResourceStatisticsSection
                resources={statistics.resources}
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
