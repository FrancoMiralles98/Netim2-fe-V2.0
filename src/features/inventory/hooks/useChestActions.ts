import { useEffect, useRef, useState } from "react";
import type { AllChest, CharacterSession, ChestGrantedReward, ChestType, GetItemsResponse, IdItemList, InventoryItem, ItemDetailsQuery, OpenChestResponse, PickChest, UpgradeLv } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { findFreeInventoryPosition } from "../inventory-placement";
import { openChestBulkRequest, openChestRequest } from "../api/chest.services";
import { getItemsRequest } from "../api/item-details.services";
import { hasSpaceForPickedChestRewards } from "../pick-chest-space";

export interface ChestReveal {
    mode: "single" | "bulk" | "pick" | "all";
    openedQuantity: number;
    options: ChestType["rewards"];
    rewards: { reward: ChestGrantedReward; name: string; stackable: boolean }[];
}

export interface PickChestSelection {
    chest: InventoryItem & PickChest;
    items: GetItemsResponse;
}

const isUpgradeLv = (value: number): value is UpgradeLv =>
    Number.isInteger(value) && value >= 0 && value <= 11;

export const useChestActions = (character: Pick<CharacterSession, "id" | "inventario">) => {
    const { applyChestResponse, runCharacterMutation } = useCharacterSession();
    const modal = useModal();
    const pending = useRef(false);
    const mounted = useRef(true);
    const finishReveal = useRef<(() => void) | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [reveal, setReveal] = useState<ChestReveal | null>(null);
    const [pickSelection, setPickSelection] = useState<PickChestSelection | null>(null);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            // El servidor ya abrió el cofre; al salir de esta pantalla no dejamos la respuesta sin aplicar.
            finishReveal.current?.();
            finishReveal.current = null;
        };
    }, []);

    const showRewards = async (
        response: OpenChestResponse,
        chest: InventoryItem & ChestType,
        mode: ChestReveal["mode"],
        openedQuantity: number,
    ) => {
        if (response.rewards.length === 0 || !mounted.current) return;

        await new Promise<void>(resolve => {
            finishReveal.current = resolve;
            setReveal({
                mode,
                openedQuantity,
                options: chest.rewards.filter(option => option.weight > 0),
                rewards: response.rewards.map(reward => {
                    const item = reward.type === "item"
                        ? response.newItems.find(entry => entry.idItem === reward.idItem)
                            ?? character.inventario.find(entry => entry.idItem === reward.idItem)
                        : undefined;
                    return {
                        reward,
                        name: reward.type === "item" ? item?.name ?? "Ítem" : reward.resource === "yang" ? "Yang" : "EXP",
                        stackable: item?.type === "utility" && item.acc
                            && !(item.type_utility === "poción" && item.potionType === "reserve"),
                    };
                }),
            });
        });
        finishReveal.current = null;
    };

    const openChest = async (chest: InventoryItem & ChestType, quantity: number, bulk: boolean) => {
        if (pending.current || (chest.rewardConfig !== "random" && chest.rewardConfig !== "all")) return;
        if (!Number.isSafeInteger(quantity) || quantity < (bulk ? 2 : 1) || quantity > chest.cantidad) return;
        if (bulk && (chest.rewardConfig !== "random" || !chest.allowBulkOpen)) return;

        const canGrantItem = chest.rewardConfig === "random"
            && chest.rewards.some(reward => reward.type_reward === "item" && reward.weight > 0);
        if (!bulk && canGrantItem && !findFreeInventoryPosition({ size: { rows: 3, cols: 1 } }, character.inventario)) {
            modal.showNotificationModal({ title: "No hay espacio suficiente en el inventario para abrir este cofre." });
            return;
        }

        pending.current = true;
        setIsPending(true);
        try {
            await runCharacterMutation(character.id, async () => {
                modal.showLoadingModal(bulk ? "Abriendo cofres..." : "Abriendo cofre...");
                let response: OpenChestResponse;
                try {
                    response = bulk
                        ? await openChestBulkRequest(character.id, { itemId: chest.id, quantity })
                        : await openChestRequest(character.id, { itemId: chest.id });
                } finally {
                    modal.closeLoadingModal();
                }

                await showRewards(response, chest, bulk ? "bulk" : chest.rewardConfig === "all" ? "all" : "single", bulk ? quantity : 1);

                applyChestResponse(character.id, response);
            });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            pending.current = false;
            if (mounted.current) setIsPending(false);
        }
    };

    const loadPickChest = async (chest: InventoryItem & PickChest) => {
        if (pending.current) return;
        const itemRewards = chest.rewards.filter(reward => reward.type_reward === "item");
        const itemIds = [...new Set(itemRewards.map(reward => reward.idItem))];
        if (itemIds.length < chest.pickCount) {
            modal.showNotificationModal({ title: "Este cofre no tiene suficientes ítems distintos para elegir." });
            return;
        }

        pending.current = true;
        setIsPending(true);
        modal.showLoadingModal("Abriendo cofre...");
        try {
            const baseItems = await getItemsRequest({ items: itemIds.map(idItem => ({ idItem })) });
            const previewQueries: ItemDetailsQuery[] = baseItems.map(item => {
                const reward = itemRewards.find(entry => entry.idItem === item.idItem);
                const upgrade = reward?.rewardOptions?.upgradeChances;
                const quantity = reward?.rewardOptions?.cantidadChances;
                const fixedUpgrade = upgrade?.min === upgrade?.max ? upgrade?.min : undefined;
                const fixedQuantity = quantity?.min === quantity?.max ? quantity?.min : undefined;

                return {
                    idItem: item.idItem,
                    ...(fixedUpgrade !== undefined && isUpgradeLv(fixedUpgrade)
                        && "upgradeMax" in item && fixedUpgrade <= item.upgradeMax
                        ? { upgradeLv: fixedUpgrade } : {}),
                    ...(fixedQuantity !== undefined && item.type === "utility" && item.acc
                        && !(item.type_utility === "poción" && item.potionType === "reserve")
                        && fixedQuantity > 0 && fixedQuantity <= item.maxCantidad
                        ? { quantity: fixedQuantity } : {}),
                };
            });
            const hasPreviewOptions = previewQueries.some(query => query.upgradeLv !== undefined || query.quantity !== undefined);
            const items = hasPreviewOptions ? await getItemsRequest({ items: previewQueries }) : baseItems;
            if (mounted.current) setPickSelection({ chest, items });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            modal.closeLoadingModal();
            pending.current = false;
            if (mounted.current) setIsPending(false);
        }
    };

    const claimPickedItems = async (selectedItemIds: IdItemList[]) => {
        const selection = pickSelection;
        if (pending.current || !selection) return;
        const { chest, items } = selection;
        if (selectedItemIds.length !== chest.pickCount || new Set(selectedItemIds).size !== chest.pickCount) return;
        const selectedRewards = selectedItemIds.map(idItem =>
            chest.rewards.find(reward => reward.type_reward === "item" && reward.idItem === idItem),
        );
        if (selectedRewards.some(reward => !reward)) return;
        const validRewards = selectedRewards.filter((reward): reward is NonNullable<typeof reward> => reward !== undefined);
        if (!hasSpaceForPickedChestRewards(character.inventario, validRewards, items)) {
            modal.showNotificationModal({ title: "No hay espacio suficiente en el inventario para los ítems seleccionados." });
            return;
        }

        pending.current = true;
        setIsPending(true);
        try {
            await runCharacterMutation(character.id, async () => {
                modal.showLoadingModal("Obteniendo ítems...");
                let response: OpenChestResponse;
                try {
                    response = await openChestRequest(character.id, { itemId: chest.id, selectedItemIds });
                } finally {
                    modal.closeLoadingModal();
                }

                if (mounted.current) setPickSelection(null);
                await showRewards(response, chest, "pick", 1);
                applyChestResponse(character.id, response);
            });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            pending.current = false;
            if (mounted.current) setIsPending(false);
        }
    };

    const onRevealStopped = () => {
        finishReveal.current?.();
        finishReveal.current = null;
    };

    return {
        openRandomChest: (chest: InventoryItem & ChestType) => openChest(chest, 1, false),
        openAllChest: (chest: InventoryItem & AllChest) => openChest(chest, 1, false),
        openManyChests: (chest: InventoryItem & ChestType, quantity: number) => openChest(chest, quantity, true),
        loadPickChest,
        claimPickedItems,
        pickSelection,
        dismissPickSelection: () => setPickSelection(null),
        reveal,
        onRevealStopped,
        dismissReveal: () => setReveal(null),
        isPending,
    };
};
