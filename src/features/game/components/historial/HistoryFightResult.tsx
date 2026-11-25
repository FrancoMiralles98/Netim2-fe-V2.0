import type { GetHistorialResponse } from "netim2-shared";
import { FightResult } from "../../../fightResult/FightResult";
import { normalizeHistoryStatistics } from "./normalize-history-statistics";

interface HistoryFightResultProps {
    response: GetHistorialResponse;
    onBack: () => void;
}

export const HistoryFightResult = ({ response, onBack }: HistoryFightResultProps) => {
    const { fight, result, rewards } = response.detalles;
    const summaries = fight.map(fighter => ({
        ...fighter,
        statistics: normalizeHistoryStatistics(fighter.statistics),
        skills: [],
    }));
    const rewardSummary = {
        historialId: response.id,
        pendingItems: rewards.pendingItems,
        result,
        initialFighters: fight,
        yang: rewards.yangGranted,
        exp: rewards.expGranted,
        items: rewards.pendingItems.map(reward => reward.item),
    };

    return (
        <>
            <button type="button" onClick={onBack} className="m-4 cursor-pointer rounded border border-amber-600 bg-stone-900 px-4 py-2 text-amber-100">
                Volver al historial
            </button>
            <FightResult summaries={summaries} response={rewardSummary} />
        </>
    );
};
