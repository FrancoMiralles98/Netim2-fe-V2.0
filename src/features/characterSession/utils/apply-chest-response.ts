import type { CharacterSession, InventoryItem, OpenChestResponse } from "netim2-shared";

export const applyChestResponseToCharacter = (
    character: CharacterSession,
    response: OpenChestResponse,
): CharacterSession => {
    const changes = new Map(response.updatedItems.map(change => [change.id, change]));
    const inventario = character.inventario.flatMap((item): InventoryItem[] => {
        const change = changes.get(item.id);
        if (!change) return [item];
        if (change.cantidad === undefined || change.cantidad <= 0) return [];
        return item.type === "utility" ? [{ ...item, cantidad: change.cantidad }] : [item];
    });

    return {
        ...character,
        inventario: [...inventario, ...response.newItems],
        yang: response.yang,
        ...(response.progress ?? {}),
        ...(response.stats ? { stats: response.stats } : {}),
        ...(response.attributes ? { atributos: response.attributes } : {}),
        ...(response.buffos ? { buffos: response.buffos } : {}),
    };
};
