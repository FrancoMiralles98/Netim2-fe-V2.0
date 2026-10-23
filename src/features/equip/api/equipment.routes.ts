export const EQUIPMENT_ROUTES = {
    equipItem: (characterId: string) => `character/${characterId}/equipment/equip`,
    unequipItem: (characterId: string) => `character/${characterId}/equipment/unequip`,
    buyEquipmentSlot: (characterId: string) => `character/${characterId}/equipment/slots/purchase`,
    selectEquipmentSlot: (characterId: string) => `character/${characterId}/equipment/selected`,
};
