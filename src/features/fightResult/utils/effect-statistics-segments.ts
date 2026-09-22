import type { ActiveStatusEffectId } from "netim2-shared";
import { STATUS_EFFECT_STATISTIC_CONFIG } from "../config/fight-statistics-visual-config";
import type { StatisticsBarSegment } from "../types/statistics-bar.types";

export const getEffectCountSegments = (
    values: Partial<Record<ActiveStatusEffectId, number>>
): StatisticsBarSegment[] => (
    Object.entries(values) as Array<[ActiveStatusEffectId, number]>
).map(([effectId, value]) => ({
    key: effectId,
    value,
    ...STATUS_EFFECT_STATISTIC_CONFIG[effectId]
}));
