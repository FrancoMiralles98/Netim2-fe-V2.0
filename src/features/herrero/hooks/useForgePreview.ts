import { useEffect, useRef, useState } from "react";
import type { InventoryItem, PreviewForgeUpgradeResponse } from "netim2-shared";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { previewForgeUpgradeRequest } from "../api/forge.services";

export const useForgePreview = (characterId: string) => {
    const [selection, setSelection] = useState<{ characterId: string; itemId: string; preview: PreviewForgeUpgradeResponse } | null>(null);
    const [isPending, setIsPending] = useState(false);
    const activeRequest = useRef<AbortController | null>(null);
    const { showLoadingModal, closeLoadingModal, showErrorModal } = useModal();

    useEffect(() => () => {
        if (!activeRequest.current) return;
        activeRequest.current.abort();
        activeRequest.current = null;
        closeLoadingModal();
    }, [characterId, closeLoadingModal]);

    const placeInForge = async (item: Extract<InventoryItem, { type: "equip" }>, modifierItemId?: string) => {
        if (activeRequest.current) return;
        const controller = new AbortController();
        activeRequest.current = controller;
        setIsPending(true);
        showLoadingModal("Obteniendo vista previa de mejora…");
        try {
            const preview = await previewForgeUpgradeRequest(characterId, { itemId: item.id, ...(modifierItemId ? { modifierItemId } : {}) }, controller.signal);
            if (!controller.signal.aborted) setSelection({ characterId, itemId: item.id, preview });
        } catch (error) {
            if (!controller.signal.aborted) showErrorModal(error);
        } finally {
            if (activeRequest.current === controller) {
                activeRequest.current = null;
                setIsPending(false);
                closeLoadingModal();
            }
        }
    };

    return {
        selection: selection?.characterId === characterId ? selection : null,
        isPending,
        placeInForge,
        clear: () => setSelection(null),
    };
};
