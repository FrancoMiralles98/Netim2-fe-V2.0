import type { ActionStatistics } from "netim2-shared";
import { ACTION_STATISTIC_CONFIG } from "../config/fight-statistics-visual-config";
import {
    getActionSegments,
    getSkippedActionSegments
} from "../utils/action-statistics-segments";
import { getSegmentsTotal } from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";
import { StatisticsBar } from "./StatisticsBar";

export interface ActionStatisticsSectionProps {
    actions: ActionStatistics;
}

export const ActionStatisticsSection = ({
    actions
}: ActionStatisticsSectionProps) => {
    const actionSegments = getActionSegments(actions);
    const totalActions = getSegmentsTotal(actionSegments);

    return (
        <div className="space-y-5">
            <StatisticsBar
                label={ACTION_STATISTIC_CONFIG.turnsPlayed.label}
                value={actions.turnsPlayed}
                segments={[{
                    key: 'turnsPlayed',
                    value: actions.turnsPlayed,
                    ...ACTION_STATISTIC_CONFIG.turnsPlayed
                }]}
                showLegend={false}
            />

            <StatisticBlock
                title="Actividad registrada"
                label="Acciones y turnos omitidos"
                value={totalActions}
                segments={actionSegments}
            />

            <StatisticBlock
                title="Turnos omitidos"
                label="Motivos de omisión"
                value={actions.skippedTurns}
                segments={getSkippedActionSegments(actions)}
            />

            {actions.turnsPlayed <= 0 && totalActions <= 0 && (
                <p className="py-3 text-center text-xs text-slate-500">
                    No se registraron acciones.
                </p>
            )}
        </div>
    );
};
