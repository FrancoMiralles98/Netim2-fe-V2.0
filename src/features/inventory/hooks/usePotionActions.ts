import { useRef, useState } from "react";
import type { CharacterSession, UsePotionRequest, UseReservePotionRequest } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { activatePotionRequest, activateReservePotionRequest } from "../api/potion.services";
import { canPotionRestore } from "../potion-restoration";

export const usePotionActions = (character: Pick<CharacterSession, "id" | "stats" | "inventario">) => {
    const { applyPotionUseResponse, runCharacterMutation } = useCharacterSession();
    const modal = useModal();
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);

    const runAction = async (action: () => Promise<void>) => {
        if (pending.current) return;
        pending.current = true;
        setIsPending(true);
        try {
            await runCharacterMutation(character.id, action);
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            pending.current = false;
            setIsPending(false);
        }
    };

    const canUsePotion = (itemId: string, potionType: "normal" | "reserve") => {
        const item = character.inventario.find(item => item.id === itemId);
        if (!item || item.type !== "utility" || item.type_utility !== "poción" || item.potionType !== potionType) return false;
        if (!canPotionRestore(item, character.stats.general)) {
            modal.showNotificationModal({ title: "Esta poción no puede recuperar vida ni maná en este momento." });
            return false;
        }
        return true;
    };

    const activatePotion = (body: UsePotionRequest) => {
        if (!canUsePotion(body.itemId, "normal")) return;
        return runAction(async () => {
            const response = await activatePotionRequest(character.id, body);
            applyPotionUseResponse(character.id, response);
        });
    };

    const activateReservePotion = (body: UseReservePotionRequest) => {
        if (!canUsePotion(body.itemId, "reserve")) return;
        return runAction(async () => {
            const response = await activateReservePotionRequest(character.id, body);
            applyPotionUseResponse(character.id, response);
        });
    };

    return { activatePotion, activateReservePotion, isPending };
};
