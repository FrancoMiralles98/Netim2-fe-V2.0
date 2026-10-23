import type { CharacterSession, EquipItemResponse, UnequipItemResponse } from "netim2-shared";

export const applyEquipmentToCharacter = (
    character: CharacterSession,
    response: EquipItemResponse,
): CharacterSession => {
    const equipmentKey = ({ 1: "equipo_1", 2: "equipo_2", 3: "equipo_3" } as const)[response.equipmentSlot];
    const returnedIds = new Set(response.newItems.map((item) => item.id));

    return {
        ...character,
        stats: response.stats,
        atributos: response.attributes,
        type_weapon: response.type_weapon,
        inventario: [
            ...character.inventario.filter((item) => item.id !== response.equippedItem.id && !returnedIds.has(item.id)),
            ...response.newItems,
        ],
        [equipmentKey]: [
            ...character[equipmentKey].filter((item) => item.sub_type_equip !== response.equippedItem.sub_type_equip),
            response.equippedItem,
        ],
    };
};

export const applyUnequipmentToCharacter = (
    character: CharacterSession,
    response: UnequipItemResponse,
): CharacterSession => {
    const equipmentKey = ({ 1: "equipo_1", 2: "equipo_2", 3: "equipo_3" } as const)[response.equipmentSlot];
    const returnedIds = new Set(response.newItems.map((item) => item.id));

    return {
        ...character,
        stats: response.stats,
        atributos: response.attributes,
        type_weapon: response.type_weapon,
        inventario: [
            ...character.inventario.filter((item) => !returnedIds.has(item.id)),
            ...response.newItems,
        ],
        [equipmentKey]: character[equipmentKey].filter((item) => item.sub_type_equip !== response.unequippedSlot),
    };
};
