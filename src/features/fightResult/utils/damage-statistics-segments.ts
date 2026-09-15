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

const DAMAGE_TYPES: DamageType[] = ['ad', 'ap', 'true'];
const DAMAGE_DELIVERIES: DamageDelivery[] = [
    'direct',
    'periodic',
    'reflected'
];

export const getDamageTypeSegments = (
    values: Record<DamageType, number>,
    total?: number
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
    const unclassified = (total ?? classifiedTotal) - classifiedTotal;

    if (unclassified <= 0) {
        return segments;
    }

    return [
        ...segments,
        {
            key: 'unclassified',
            value: unclassified,
            ...UNCLASSIFIED_STATISTIC_CONFIG
        }
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
    >
): StatisticsBarSegment[] => Object.entries(values).map(
    ([skillId, statistics], index) => ({
        key: skillId,
        value: statistics.total,
        label: `Habilidad #${skillId}`,
        colorClass:
            SKILL_STATISTIC_COLOR_CLASSES[
                index % SKILL_STATISTIC_COLOR_CLASSES.length
            ]
    })
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
