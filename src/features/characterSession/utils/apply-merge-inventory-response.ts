import type { CharacterSession, InventoryItem, MergeInventoryItemsResponse } from "netim2-shared";

export const applyMergeInventoryResponseToCharacter = (
    character: CharacterSession,
    response: MergeInventoryItemsResponse,
): CharacterSession => {
    const changes = new Map(response.updatedItems.map((change) => [change.id, change]));

    return {
        ...character,
        inventario: character.inventario.flatMap((item): InventoryItem[] => {
            const change = changes.get(item.id);
            if (!change) return [item];
            if (change.cantidad === undefined || change.cantidad <= 0) return [];
            return item.type === "utility" ? [{ ...item, cantidad: change.cantidad }] : [item];
        }),
    };
};
