import { useRef, useState } from "react";
import type { BuyEquipmentSlotRequest, CharacterSession, EquipType, InventoryItem, SelectEquipmentRequest } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useUserSession } from "../../userSession/hook/useUserSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { findFreeInventoryPosition } from "../../inventory/inventory-placement";
import { buyEquipmentSlotRequest, equipItemRequest, selectEquipmentSlotRequest, unequipItemRequest } from "../api/equipment.services";

export const useEquipmentActions = (character: Pick<CharacterSession, "id" | "lv" | "raza">) => {
    const { applyEquipmentResponse, applyUnequipmentResponse, applyEquipmentSlotPurchaseResponse, applyEquipmentSelectionResponse, runCharacterMutation } = useCharacterSession();
    const { updateUserData } = useUserSession();
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
            const response = await equipItemRequest(character.id, { itemId: item.id });
            applyEquipmentResponse(character.id, response);
        });
    };

    const unequipItem = async (item: EquipType, inventoryItems: InventoryItem[]) => {
        if (pending.current) return;

        if (!findFreeInventoryPosition(item, inventoryItems)) {
            modal.showFeedBackModal({
                title: "No puedes desequipar este ítem",
                messages: ["No hay espacio suficiente en el inventario."],
                onAccept: modal.closeModal,
            });
            return;
        }

        await runAction(async () => {
            const response = await unequipItemRequest(character.id, { subType: item.sub_type_equip });
            applyUnequipmentResponse(character.id, response);
        });
    };

    const buyEquipmentSlot = async (slot: BuyEquipmentSlotRequest['slot']) => {
        if (pending.current) return;

        await runAction(async () => {
            const response = await buyEquipmentSlotRequest(character.id, { slot });
            applyEquipmentSlotPurchaseResponse(character.id, response);
            if (response.currency === 'md') {
                updateUserData({ md: response.md });
            }
            modal.showNotificationModal({ title: `Se confirmó la compra de la ranura de equipo ${slot}.` });
        });
    };

    const selectEquipmentSlot = async (slot: SelectEquipmentRequest['slot']) => {
        if (pending.current) return;

        await runAction(async () => {
            const response = await selectEquipmentSlotRequest(character.id, { slot });
            applyEquipmentSelectionResponse(character.id, response);
        });
    };

    return { equipItem, unequipItem, buyEquipmentSlot, selectEquipmentSlot, isPending };
};
