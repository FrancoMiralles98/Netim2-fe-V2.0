export const INVENTORY_ROUTES = {
    equipItem: (characterId: string) => `character/${characterId}/equipment/equip`,
    moveItem: (characterId: string) => `character/${characterId}/inventory/move`,
};
