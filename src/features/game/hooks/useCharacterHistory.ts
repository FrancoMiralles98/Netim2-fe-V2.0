import { useEffect, useState } from "react";
import type { PartialHistorialDetalle } from "netim2-shared";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { getCharacterHistoryRequest } from "../api/character-history.services";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";

type HistoryState =
    | { status: "loading" | "error" }
    | { status: "ready"; entries: PartialHistorialDetalle[] };

export const useCharacterHistory = (characterId: string) => {
    const { historyRewardClaims } = useCharacterSession();
    const [state, setState] = useState<HistoryState>({ status: "loading" });
    const [attempt, setAttempt] = useState(0);
    const { showLoadingModal, closeLoadingModal } = useModal();

    useEffect(() => {
        const controller = new AbortController();
        let pending = true;
        showLoadingModal("Obteniendo historial…");
        const load = async () => {
            try {
                const entries = await getCharacterHistoryRequest(characterId, {}, controller.signal);
                if (!controller.signal.aborted) {
                    setState({ status: "ready", entries: [...entries].sort((first, second) => second.fecha - first.fecha) });
                }
            } catch {
                if (!controller.signal.aborted) setState({ status: "error" });
            } finally {
                pending = false;
                if (!controller.signal.aborted) closeLoadingModal();
            }
        };
        void load();
        return () => {
            controller.abort();
            if (pending) closeLoadingModal();
        };
    }, [characterId, attempt, showLoadingModal, closeLoadingModal]);

    return {
        state: state.status === "ready" ? {
            ...state,
            entries: state.entries.map(entry => {
                const claim = historyRewardClaims[entry.id];
                return claim ? {
                    ...entry,
                    pendingRewardCount: claim.pendingItems.length,
                    remainingReward: claim.remainingReward,
                } : entry;
            }),
        } : state,
        retry: () => {
            setState({ status: "loading" });
            setAttempt(current => current + 1);
        },
    };
};
