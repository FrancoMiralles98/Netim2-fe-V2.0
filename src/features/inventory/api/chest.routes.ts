export const CHEST_ROUTES = {
    open: (characterId: string) => `character/${characterId}/item-use/chests`,
    openBulk: (characterId: string) => `character/${characterId}/item-use/chests/bulk`,
};
