import { useEffect, useRef, useState } from "react";
import type { InventoryItem, NpcShopId } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { sellShopItemRequest } from "../api/shop.services";

export const useShopSale = (shopId: NpcShopId) => {
    const { character, applyShopSaleResponse, runCharacterMutation } = useCharacterSession();
    const { showLoadingModal, closeLoadingModal, showErrorModal } = useModal();
    const [isPending, setIsPending] = useState(false);
    const pending = useRef(false);
    const latestCharacter = useRef(character);
    useEffect(() => { latestCharacter.current = character; }, [character]);

    const sell = async (item: InventoryItem, quantity: number) => {
        if (!character || pending.current || !Number.isSafeInteger(quantity) || quantity < 1) return;
        const characterId = character.id;
        pending.current = true;
        setIsPending(true);
        showLoadingModal("Vendiendo ítem…");
        try {
            await runCharacterMutation(characterId, async () => {
                const current = latestCharacter.current;
                if (!current || current.id !== characterId) return;
                const inventoryItem = current.inventario.find(entry => entry.id === item.id);
                if (!inventoryItem || quantity > (inventoryItem.type === "utility" ? inventoryItem.cantidad : 1)) return;
                const response = await sellShopItemRequest(shopId, characterId, { itemId: item.id, quantity });
                applyShopSaleResponse(characterId, response);
            });
        } catch (error) {
            showErrorModal(error);
        } finally {
            pending.current = false;
            setIsPending(false);
            closeLoadingModal();
        }
    };

    return { sell, isPending };
};
