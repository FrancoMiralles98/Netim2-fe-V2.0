import type { ChestType, InventoryItem, ItemDTO } from "netim2-shared";
import { findFreeInventoryPosition } from "./inventory-placement";

const REWARD_SIZE = { rows: 3, cols: 1 };

export const hasSpaceForPickedChestRewards = (
    inventory: InventoryItem[],
    rewards: ChestType["rewards"],
    items: ItemDTO[],
): boolean => {
    const occupied: Pick<InventoryItem, "id" | "size" | "position">[] = inventory.map(item => ({
        id: item.id,
        size: item.size,
        position: item.position,
    }));

    for (const reward of rewards) {
        if (reward.type_reward !== "item") continue;
        const item = items.find(candidate => candidate.idItem === reward.idItem);
        if (!item) return false;

        const maxQuantity = reward.rewardOptions?.cantidadChances?.max ?? 1;
        const stackable = item.type === "utility" && item.acc
            && !(item.type_utility === "poción" && item.potionType === "reserve");
        const requiredSlots = stackable && item.type === "utility"
            ? Math.ceil(maxQuantity / item.maxCantidad)
            : maxQuantity;
        if (!Number.isSafeInteger(requiredSlots) || requiredSlots < 1) return false;

        for (let index = 0; index < requiredSlots; index++) {
            const position = findFreeInventoryPosition({ size: REWARD_SIZE }, occupied);
            if (!position) return false;
            occupied.push({ id: `pick-preview-${occupied.length}`, size: REWARD_SIZE, position });
        }
    }

    return true;
};
