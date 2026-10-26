import type { InventoryItem } from "netim2-shared";

const ITEM_IMAGE_GROUPS = [
    { ids: Array.from({ length: 44 }, (_, index) => 2001 + index), extension: "jpg" },
] as const;

export const getItemImagePath = (idItem: InventoryItem["idItem"]): string | null => {
    const numericId = typeof idItem === "number" ? idItem : Number(idItem);
    if (!Number.isSafeInteger(numericId) || numericId < 0) return null;

    const imageGroup = ITEM_IMAGE_GROUPS.find(({ ids }) => ids.some(id => id === numericId));
    return `/items/${numericId}.${imageGroup?.extension ?? "png"}`;
};
