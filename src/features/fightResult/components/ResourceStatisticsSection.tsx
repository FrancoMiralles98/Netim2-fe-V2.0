import type { ResourceStatistics } from "netim2-shared";
import {
    getManaOutflowSegments,
    getManaRecoverySegments
} from "../utils/resource-statistics-segments";
import {
    getPositiveSegments,
    getSegmentsTotal
} from "../utils/statistics-bar.utils";
import { StatisticBlock } from "./StatisticBlock";

export interface ResourceStatisticsSectionProps {
    resources: ResourceStatistics;
}

export const ResourceStatisticsSection = ({
    resources
}: ResourceStatisticsSectionProps) => {
    const outflowSegments = getPositiveSegments(
        getManaOutflowSegments(resources)
    );
    const recoverySegments = getPositiveSegments(
        getManaRecoverySegments(resources)
    );
    const outflowTotal = getSegmentsTotal(outflowSegments);
    const recoveryTotal = getSegmentsTotal(recoverySegments);

    return (
        <div className="space-y-5">
            <StatisticBlock
                title="Salidas de maná"
                label="Maná gastado o drenado"
                value={outflowTotal}
                segments={outflowSegments}
            />

            <StatisticBlock
                title="Recuperación de maná"
                label="Maná recuperado"
                value={recoveryTotal}
                segments={recoverySegments}
            />

            {outflowTotal <= 0 && recoveryTotal <= 0 && (
                <p className="py-3 text-center text-xs text-slate-500">
                    No se registraron cambios de recursos.
                </p>
            )}
        </div>
    );
};
