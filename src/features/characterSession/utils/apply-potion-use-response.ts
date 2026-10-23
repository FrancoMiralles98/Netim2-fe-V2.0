import type { CharacterSession, InventoryItem, UsePotionResponse, UseReservePotionResponse } from "netim2-shared";

export const applyPotionUseResponseToCharacter = (
    character: CharacterSession,
    response: UsePotionResponse | UseReservePotionResponse,
): CharacterSession => {
    const changes = new Map(response.updatedItems.map((change) => [change.id, change]));
    const updatedPotion = "updatedPotion" in response ? response.updatedPotion : null;

    const inventario = character.inventario.flatMap((item): InventoryItem[] => {
        const change = changes.get(item.id);
        if (change && (change.cantidad === undefined || change.cantidad <= 0)) return [];

        let updatedItem = item;
        if (change && item.type === "utility") {
            updatedItem = { ...item, cantidad: change.cantidad! };
        }
        if (updatedPotion?.id === item.id && updatedItem.type === "utility" && updatedItem.type_utility === "poción" && updatedItem.potionType === "reserve") {
            updatedItem = { ...updatedItem, resource: updatedPotion.resource, reserve: updatedPotion.reserve };
        }
        return [updatedItem];
    });

    return {
        ...character,
        inventario,
        stats: {
            ...character.stats,
            general: {
                ...character.stats.general,
                hp: { ...character.stats.general.hp, actual: response.hp },
                mana: { ...character.stats.general.mana, actual: response.mana },
            },
        },
    };
};
