import { useEffect, useRef, useState } from "react";
import type { GetHistorialResponse } from "netim2-shared";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { getCharacterHistoryDetailRequest } from "../api/character-history.services";

export const useHistoryDetail = (characterId: string | undefined) => {
    const [response, setResponse] = useState<GetHistorialResponse | null>(null);
    const requestRef = useRef<AbortController | null>(null);
    const { showLoadingModal, closeLoadingModal, showErrorModal } = useModal();

    useEffect(() => () => {
        if (!requestRef.current) return;
        requestRef.current.abort();
        requestRef.current = null;
        closeLoadingModal();
    }, [characterId, closeLoadingModal]);

    const openDetail = async (historialId: string) => {
        if (!characterId || requestRef.current) return;
        const controller = new AbortController();
        requestRef.current = controller;
        showLoadingModal("Obteniendo detalle del combate…");
        try {
            const detail = await getCharacterHistoryDetailRequest(characterId, { historialId }, controller.signal);
            if (!controller.signal.aborted) setResponse(detail);
        } catch (error) {
            if (!controller.signal.aborted) showErrorModal(error);
        } finally {
            if (requestRef.current === controller) {
                requestRef.current = null;
                closeLoadingModal();
            }
        }
    };

    return {
        response: response?.characterId === characterId ? response : null,
        openDetail,
        closeDetail: () => setResponse(null),
    };
};
