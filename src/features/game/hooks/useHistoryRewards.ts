import { useEffect, useRef, useState } from "react";
import type { PendingHistoryReward } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { claimCharacterHistoryRewardsRequest, getCharacterHistoryDetailRequest } from "../api/character-history.services";

export const useHistoryRewards = (historialId: string, initialRewards?: PendingHistoryReward[]) => {
    const { character, historyRewardClaims, applyHistoryRewardsClaimResponse, runCharacterMutation } = useCharacterSession();
    const { showLoadingModal, closeLoadingModal, showErrorModal } = useModal();
    const [loadedRewards, setLoadedRewards] = useState<PendingHistoryReward[] | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);
    const claimPending = useRef(false);
    const claim = historyRewardClaims[historialId];
    const pendingItems = claim?.pendingItems ?? loadedRewards ?? initialRewards;
    const characterId = character?.id;

    useEffect(() => {
        if (!characterId || initialRewards || claim) return;
        const controller = new AbortController();
        const load = async () => {
            try {
                const detail = await getCharacterHistoryDetailRequest(characterId, { historialId }, controller.signal);
                if (!controller.signal.aborted) setLoadedRewards(detail.detalles.rewards.pendingItems);
            } catch {
                if (!controller.signal.aborted) setLoadError(true);
            }
        };
        void load();
        return () => controller.abort();
    }, [characterId, historialId, initialRewards, claim, attempt]);

    const claimRewards = async (rewardIds: string[]) => {
        if (!characterId || claimPending.current || !pendingItems || rewardIds.length === 0) return;
        const ids = [...new Set(rewardIds)];
        if (!ids.every(id => pendingItems.some(reward => reward.rewardId === id))) return;
        claimPending.current = true;
        setIsClaiming(true);
        showLoadingModal("Reclamando recompensas…");
        try {
            await runCharacterMutation(characterId, async () => {
                const response = await claimCharacterHistoryRewardsRequest(characterId, { historialId, rewardIds: ids });
                applyHistoryRewardsClaimResponse(characterId, response);
            });
        } catch (error) {
            showErrorModal(error);
        } finally {
            claimPending.current = false;
            setIsClaiming(false);
            closeLoadingModal();
        }
    };

    return {
        pendingItems,
        isClaiming,
        loadError,
        claimRewards,
        retry: () => {
            setLoadError(false);
            setAttempt(current => current + 1);
        },
    };
};
