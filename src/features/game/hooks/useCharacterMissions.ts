import { useEffect, useRef, useState } from "react";
import type { MissionListEntry } from "netim2-shared";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { claimCharacterMissionRequest, getCharacterMissionsRequest } from "../api/character-missions.services";

type MissionListState =
    | { status: "loading" | "error" }
    | { status: "ready"; missions: MissionListEntry[] };

export const useCharacterMissions = (characterId: string) => {
    const { showLoadingModal, closeLoadingModal, showErrorModal } = useModal();
    const { runCharacterMutation, applyMissionClaimResponse } = useCharacterSession();
    const [state, setState] = useState<MissionListState>({ status: "loading" });
    const [attempt, setAttempt] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);
    const claimPending = useRef(false);

    useEffect(() => {
        const controller = new AbortController();
        let pending = true;
        showLoadingModal("Obteniendo misiones...");

        const loadMissions = async () => {
            try {
                const response = await getCharacterMissionsRequest(characterId, controller.signal);
                if (!controller.signal.aborted) {
                    setState({ status: "ready", missions: response.active });
                }
            } catch {
                if (!controller.signal.aborted) setState({ status: "error" });
            } finally {
                pending = false;
                if (!controller.signal.aborted) closeLoadingModal();
            }
        };

        void loadMissions();
        return () => {
            controller.abort();
            if (pending) closeLoadingModal();
        };
    }, [attempt, characterId, closeLoadingModal, showLoadingModal]);

    const retry = () => {
        setState({ status: "loading" });
        setAttempt((current) => current + 1);
    };

    const claim = async (mission: MissionListEntry) => {
        const attemptId = mission.progress?.attemptId;
        if (mission.status !== "ready_to_claim" || !attemptId || claimPending.current) return;

        claimPending.current = true;
        setIsClaiming(true);
        showLoadingModal("Reclamando misión...");
        try {
            await runCharacterMutation(characterId, async () => {
                const response = await claimCharacterMissionRequest(characterId, { missionId: mission.id, attemptId });
                applyMissionClaimResponse(characterId, response);
            });
            retry();
        } catch (error) {
            showErrorModal(error);
        } finally {
            closeLoadingModal();
            claimPending.current = false;
            setIsClaiming(false);
        }
    };

    return { state, retry, claim, isClaiming };
};
