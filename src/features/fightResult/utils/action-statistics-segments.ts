import type { ActionStatistics } from "netim2-shared";
import {
    ACTION_STATISTIC_CONFIG,
    OTHER_SKIPPED_ACTION_CONFIG
} from "../config/fight-statistics-visual-config";
import type { StatisticsBarSegment } from "../types/statistics-bar.types";

export const getActionSegments = (
    actions: ActionStatistics
): StatisticsBarSegment[] => [
    {
        key: 'basicAttacksUsed',
        value: actions.basicAttacksUsed,
        ...ACTION_STATISTIC_CONFIG.basicAttacksUsed
    },
    {
        key: 'skillsUsed',
        value: actions.skillsUsed,
        ...ACTION_STATISTIC_CONFIG.skillsUsed
    },
    {
        key: 'skippedTurns',
        value: actions.skippedTurns,
        ...ACTION_STATISTIC_CONFIG.skippedTurns
    }
];

export const getSkippedActionSegments = (
    actions: ActionStatistics
): StatisticsBarSegment[] => {
    const stunned = Math.min(
        Math.max(0, actions.skippedByStun),
        Math.max(0, actions.skippedTurns)
    );

    return [
        {
            key: 'skippedByStun',
            value: stunned,
            ...ACTION_STATISTIC_CONFIG.skippedByStun
        },
        {
            key: 'otherSkippedTurns',
            value: Math.max(0, actions.skippedTurns - stunned),
            ...OTHER_SKIPPED_ACTION_CONFIG
        }
    ];
};
