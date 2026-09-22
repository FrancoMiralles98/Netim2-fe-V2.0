import type { HitStatistics } from "netim2-shared";
import { HIT_STATISTIC_CONFIG } from "../config/fight-statistics-visual-config";
import type { StatisticsBarSegment } from "../types/statistics-bar.types";

const toHitSegment = (
    key: keyof typeof HIT_STATISTIC_CONFIG,
    value: number
): StatisticsBarSegment => ({
    key,
    value,
    ...HIT_STATISTIC_CONFIG[key]
});

export const getOffensiveHitResultSegments = (
    hits: HitStatistics
): StatisticsBarSegment[] => [
    toHitSegment('successful', hits.successful),
    toHitSegment('missed', hits.missed)
];

export const getSpecialHitSegments = (
    hits: HitStatistics
): StatisticsBarSegment[] => [
    toHitSegment('critical', hits.critical),
    toHitSegment('penetrating', hits.penetrating),
    toHitSegment(
        'doubleHitsTriggered',
        hits.doubleHitsTriggered
    )
];

export const getDefensiveHitSegments = (
    hits: HitStatistics
): StatisticsBarSegment[] => [
    toHitSegment('dodged', hits.dodged),
    toHitSegment('blocked', hits.blocked),
    toHitSegment('reflected', hits.reflected)
];
