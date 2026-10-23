export const INVENTORY_ROUTES = {
    moveItem: (characterId: string) => `character/${characterId}/inventory/move`,
    splitItem: (characterId: string) => `character/${characterId}/inventory/split`,
    mergeItems: (characterId: string) => `character/${characterId}/inventory/merge`,
    discardItem: (characterId: string, itemId: string) => `character/${characterId}/inventory/${encodeURIComponent(itemId)}`,
};
