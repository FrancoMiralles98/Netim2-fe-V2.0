export const POTION_ROUTES = {
    activate: (characterId: string) => `character/${characterId}/item-use/potions`,
    activateReserve: (characterId: string) => `character/${characterId}/item-use/potions/reserve`,
};
