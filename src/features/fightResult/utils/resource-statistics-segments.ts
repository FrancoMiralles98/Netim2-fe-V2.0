import type { ResourceStatistics } from "netim2-shared";
import { RESOURCE_STATISTIC_CONFIG } from "../config/fight-statistics-visual-config";
import type { StatisticsBarSegment } from "../types/statistics-bar.types";

type ResourceStatisticKey = keyof ResourceStatistics;

const toResourceSegment = (
    key: ResourceStatisticKey,
    value: number
): StatisticsBarSegment => ({
    key,
    value,
    ...RESOURCE_STATISTIC_CONFIG[key]
});

export const getManaOutflowSegments = (
    resources: ResourceStatistics
): StatisticsBarSegment[] => [
    toResourceSegment('manaSpent', resources.manaSpent),
    toResourceSegment('manaDrained', resources.manaDrained)
];

export const getManaRecoverySegments = (
    resources: ResourceStatistics
): StatisticsBarSegment[] => [
    toResourceSegment(
        'manaRegenerated',
        resources.manaRegenerated
    ),
    toResourceSegment(
        'manaRestored',
        resources.manaRestored
    )
];
