import type { HealingStatistics } from "netim2-shared";
import {
    HEALING_PREVENTED_STATISTIC_CONFIG,
    HEALING_SOURCE_STATISTIC_CONFIG,
    SKILL_STATISTIC_COLOR_CLASSES
} from "../config/fight-statistics-visual-config";
import type { StatisticsBarSegment } from "../types/statistics-bar.types";

const getSkillHealingTotal = (
    healing: HealingStatistics
): number => healing.bySkill.reduce(
    (total, skill) => total + Math.max(0, skill.amount),
    0
);

export const getHealingSourceSegments = (
    healing: HealingStatistics
): StatisticsBarSegment[] => [
    {
        key: 'byBasicAttack',
        value: healing.byBasicAttack,
        ...HEALING_SOURCE_STATISTIC_CONFIG.byBasicAttack
    },
    {
        key: 'bySkill',
        value: getSkillHealingTotal(healing),
        ...HEALING_SOURCE_STATISTIC_CONFIG.bySkill
    },
    {
        key: 'hpRegenerated',
        value: healing.hpRegenerated,
        ...HEALING_SOURCE_STATISTIC_CONFIG.hpRegenerated
    }
];

export const getSkillHealingSegments = (
    healing: HealingStatistics
): StatisticsBarSegment[] => healing.bySkill.map(
    (skill, index) => ({
        key: String(skill.idSkill),
        value: skill.amount,
        label: `Habilidad #${skill.idSkill}`,
        colorClass:
            SKILL_STATISTIC_COLOR_CLASSES[
                index % SKILL_STATISTIC_COLOR_CLASSES.length
            ]
    })
);

export const getPreventedHealingSegments = (
    healing: HealingStatistics
): StatisticsBarSegment[] => [{
    key: 'prevented',
    value: healing.prevented,
    ...HEALING_PREVENTED_STATISTIC_CONFIG
}];
