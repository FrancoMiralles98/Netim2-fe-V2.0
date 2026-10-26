import type { ApplyBuffResponse, CharacterSession, InventoryItem } from "netim2-shared";

export const applyBuffResponseToCharacter = (
    character: CharacterSession,
    response: ApplyBuffResponse,
): CharacterSession => {
    const changes = new Map(response.updatedItems.map((change) => [change.id, change]));

    return {
        ...character,
        stats: response.stats,
        atributos: response.attributes,
        buffos: response.buffos,
        inventario: character.inventario.flatMap((item): InventoryItem[] => {
            const change = changes.get(item.id);
            if (!change) return [item];
            if (change.cantidad === undefined || change.cantidad <= 0) return [];
            return item.type === "utility" ? [{ ...item, cantidad: change.cantidad }] : [item];
        }),
    };
};
