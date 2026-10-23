import { useRef, useState } from "react";
import type { CharacterSession, DiscardInventoryItemRequest, InventoryItem, MoveInventoryItemRequest, SplitInventoryItemRequest } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { discardInventoryItemRequest, mergeInventoryItemsRequest, moveInventoryItemRequest, splitInventoryItemRequest } from "../api/inventory.services";
import { findFreeInventoryPosition } from "../inventory-placement";
import { canMergeInventoryItems } from "../inventory-merge";

export const useInventoryActions = (character: Pick<CharacterSession, "id">) => {
    const { updateInventoryItemPosition, applySplitInventoryItemResponse, applyMergeInventoryItemsResponse, applyDiscardInventoryItemResponse, runCharacterMutation } = useCharacterSession();
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

    const moveItem = (body: MoveInventoryItemRequest) => runAction(async () => {
        const movedItem = await moveInventoryItemRequest(character.id, body);
        updateInventoryItemPosition(character.id, movedItem);
    });

    const splitItem = (item: InventoryItem, items: InventoryItem[], quantity: SplitInventoryItemRequest['quantity']) => {
        if (pending.current || item.type !== "utility" || !item.acc || item.maxCantidad <= 1) return;
        if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity >= item.cantidad) return;

        if (!findFreeInventoryPosition(item, items)) {
            modal.showNotificationModal({ title: "No hay espacio suficiente en el inventario para dividir el ítem." });
            return;
        }

        return runAction(async () => {
            const response = await splitInventoryItemRequest(character.id, { itemId: item.id, quantity });
            applySplitInventoryItemResponse(character.id, response);
        });
    };

    const mergeItems = (source: InventoryItem, target: InventoryItem) => {
        if (pending.current || source.type !== "utility" || target.type !== "utility" || !canMergeInventoryItems(source, target)) return;
        const quantity = Math.min(source.cantidad, target.maxCantidad - target.cantidad);

        return runAction(async () => {
            const response = await mergeInventoryItemsRequest(character.id, {
                itemId: source.id,
                targetItemId: target.id,
                quantity,
            });
            applyMergeInventoryItemsResponse(character.id, response);
        });
    };

    const discardItem = (body: DiscardInventoryItemRequest) => runAction(async () => {
        const response = await discardInventoryItemRequest(character.id, body);
        applyDiscardInventoryItemResponse(character.id, response);
    });

    return { moveItem, splitItem, mergeItems, discardItem, isPending };
};
