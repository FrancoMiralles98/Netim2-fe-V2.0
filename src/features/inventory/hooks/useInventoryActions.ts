import { useRef, useState } from "react";
import type { CharacterSession, InventoryItem, MoveInventoryItemRequest } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { equipInventoryItemRequest, moveInventoryItemRequest } from "../api/inventory.services";

export const useInventoryActions = (character: Pick<CharacterSession, "id" | "lv" | "raza">) => {
    const { updateInventoryItemPosition, applyEquipmentResponse } = useCharacterSession();
    const modal = useModal();
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);

    const runAction = async (action: () => Promise<void>) => {
        if (pending.current) return;
        pending.current = true;
        setIsPending(true);

        try {
            await action();
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

    const equipItem = async (item: InventoryItem) => {
        if (pending.current || item.type !== "equip") return;

        const messages: string[] = [];
        if (character.lv < item.lvReq) {
            messages.push(`Necesitas nivel ${item.lvReq} para equipar ${item.name}. Tu nivel actual es ${character.lv}.`);
        }
        if (item.restricted.length > 0 && !item.restricted.includes(character.raza)) {
            messages.push(`Tu raza (${character.raza}) no puede usar ${item.name}. Razas habilitadas: ${item.restricted.join(", ")}.`);
        }
        if (messages.length > 0) {
            modal.showFeedBackModal({ title: "No puedes equipar este ítem", messages, onAccept: modal.closeModal });
            return;
        }

        await runAction(async () => {
            const response = await equipInventoryItemRequest(character.id, { itemId: item.id });
            applyEquipmentResponse(character.id, response);
        });
    };

    return { moveItem, equipItem, isPending };
};
