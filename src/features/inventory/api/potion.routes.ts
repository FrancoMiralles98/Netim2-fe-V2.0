export const POTION_ROUTES = {
    quickHeal: (characterId: string) => `character/${characterId}/item-use/potions/quick-heal`,
    activate: (characterId: string) => `character/${characterId}/item-use/potions`,
    activateReserve: (characterId: string) => `character/${characterId}/item-use/potions/reserve`,
};
