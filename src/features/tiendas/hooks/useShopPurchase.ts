import { useEffect, useRef, useState } from "react";
import type { NpcShopId, ShopItemOffer } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { buyShopItemRequest } from "../api/shop.services";

export const useShopPurchase = (shopId: NpcShopId) => {
    const { character, applyShopPurchaseResponse, runCharacterMutation } = useCharacterSession();
    const { showLoadingModal, closeLoadingModal, showNotificationModal, showErrorModal } = useModal();
    const [isPending, setIsPending] = useState(false);
    const pending = useRef(false);
    const latestCharacter = useRef(character);
    useEffect(() => { latestCharacter.current = character; }, [character]);

    const buy = async (offer: ShopItemOffer, quantity: number) => {
        if (!character || pending.current) return;
        if (!Number.isSafeInteger(quantity) || quantity < offer.quantity || quantity > offer.maxQuantity || quantity % offer.quantity !== 0) return;
        const total = offer.price * quantity;
        if (!Number.isSafeInteger(total) || total < 0) return;
        const insufficientYang = () => showNotificationModal({ title: "No tenés suficiente yang para realizar esta compra." });
        if (character.yang < total) {
            insufficientYang();
            return;
        }

        const characterId = character.id;
        pending.current = true;
        setIsPending(true);
        showLoadingModal("Comprando ítem…");
        try {
            await runCharacterMutation(characterId, async () => {
                const current = latestCharacter.current;
                if (!current || current.id !== characterId) return;
                if (current.yang < total) {
                    insufficientYang();
                    return;
                }
                const response = await buyShopItemRequest(shopId, characterId, {
                    idItem: offer.idItem,
                    quantity,
                    ...(offer.upgradeLv !== undefined ? { upgradeLv: offer.upgradeLv } : {}),
                });
                applyShopPurchaseResponse(characterId, response);
            });
        } catch (error) {
            showErrorModal(error);
        } finally {
            pending.current = false;
            setIsPending(false);
            closeLoadingModal();
        }
    };

    return { buy, isPending };
};
