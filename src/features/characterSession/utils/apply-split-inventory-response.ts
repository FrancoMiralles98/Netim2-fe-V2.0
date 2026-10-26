import type { CharacterSession, InventoryItem, SplitInventoryItemResponse } from "netim2-shared";

export const applySplitInventoryResponseToCharacter = (
    character: CharacterSession,
    response: SplitInventoryItemResponse,
): CharacterSession => {
    const changes = new Map(response.updatedItems.map((change) => [change.id, change]));
    const newIds = new Set(response.newItems.map((item) => item.id));

    const retainedItems = character.inventario.flatMap((item): InventoryItem[] => {
        if (newIds.has(item.id)) return [];
        const change = changes.get(item.id);
        if (!change) return [item];
        if (change.cantidad === undefined || change.cantidad <= 0) return [];
        return item.type === "utility" ? [{ ...item, cantidad: change.cantidad }] : [item];
    });

    return { ...character, inventario: [...retainedItems, ...response.newItems] };
};
