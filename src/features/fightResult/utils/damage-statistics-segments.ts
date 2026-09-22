import type {
    ActiveStatusEffectId,
    DamageDelivery,
    DamageSourceStatistics,
    DamageType,
    SkillDamageStatistics,
    UNIQUE_ID_SKILLS
} from "netim2-shared";
import {
    DAMAGE_DELIVERY_STATISTIC_CONFIG,
    DAMAGE_SOURCE_STATISTIC_CONFIG,
    DAMAGE_TYPE_STATISTIC_CONFIG,
    SKILL_STATISTIC_COLOR_CLASSES,
    STATUS_EFFECT_STATISTIC_CONFIG,
    UNCLASSIFIED_STATISTIC_CONFIG
} from "../config/fight-statistics-visual-config";
import type { StatisticsBarSegment } from "../types/statistics-bar.types";
import type { FighterFightSummarySkill } from "../types/fighter-fight-summary.types";
import { getSkillStatisticVisual } from "./skill-statistics-visual";

const DAMAGE_TYPES: DamageType[] = ['ad', 'ap', 'true'];
const DAMAGE_DELIVERIES: DamageDelivery[] = [
    'direct',
    'periodic',
    'reflected'
];

export const getDamageTypeSegments = (
    values: Record<DamageType, number>,
    total?: number,
    statusEffectDamage = 0
): StatisticsBarSegment[] => {
    const segments = DAMAGE_TYPES.map(type => ({
        key: type,
        value: values[type],
        ...DAMAGE_TYPE_STATISTIC_CONFIG[type]
    }));
    const classifiedTotal = segments.reduce(
        (current, segment) =>
            current + Math.max(0, segment.value),
        0
    );
    const unclassified = Math.max(
        0,
        (total ?? classifiedTotal) - classifiedTotal
    );
    const statusEffectTotal = Math.min(
        unclassified,
        Math.max(0, statusEffectDamage)
    );
    const remainingUnclassified = unclassified - statusEffectTotal;

    if (unclassified <= 0) {
        return segments;
    }

    return [
        ...segments,
        ...(statusEffectTotal > 0 ? [{
            key: 'statusEffects',
            value: statusEffectTotal,
            ...DAMAGE_SOURCE_STATISTIC_CONFIG.statusEffects
        }] : []),
        ...(remainingUnclassified > 0 ? [{
            key: 'unclassified',
            value: remainingUnclassified,
            ...UNCLASSIFIED_STATISTIC_CONFIG
        }] : [])
    ];
};

export const getDamageDeliverySegments = (
    values: Record<DamageDelivery, number>
): StatisticsBarSegment[] => DAMAGE_DELIVERIES.map(delivery => ({
    key: delivery,
    value: values[delivery],
    ...DAMAGE_DELIVERY_STATISTIC_CONFIG[delivery]
}));

export const getDamageSourceSegments = (
    values: DamageSourceStatistics
): StatisticsBarSegment[] => (
    Object.keys(DAMAGE_SOURCE_STATISTIC_CONFIG) as Array<
        keyof DamageSourceStatistics
    >
).map(source => ({
    key: source,
    value: values[source],
    ...DAMAGE_SOURCE_STATISTIC_CONFIG[source]
}));

export const getSkillDamageSegments = (
    values: Partial<
        Record<UNIQUE_ID_SKILLS, SkillDamageStatistics>
    >,
    skills: FighterFightSummarySkill[]
): StatisticsBarSegment[] => Object.entries(values).map(
    ([rawSkillId, statistics], index) => {
        const skillId = Number(rawSkillId) as UNIQUE_ID_SKILLS;

        return {
            key: rawSkillId,
            value: statistics.total,
            ...getSkillStatisticVisual(skillId, skills),
            colorClass:
                SKILL_STATISTIC_COLOR_CLASSES[
                    index % SKILL_STATISTIC_COLOR_CLASSES.length
                ]
        };
    }
);

export const getStatusEffectDamageSegments = (
    values: Partial<Record<ActiveStatusEffectId, number>>
): StatisticsBarSegment[] => (
    Object.entries(values) as Array<
        [ActiveStatusEffectId, number]
    >
).map(([effectId, value]) => ({
    key: effectId,
    value,
    ...STATUS_EFFECT_STATISTIC_CONFIG[effectId]
}));
