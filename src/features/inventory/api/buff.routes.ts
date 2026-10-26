export const BUFF_ROUTES = {
    apply: (characterId: string) => `character/${characterId}/item-use/buffs`,
    refresh: (characterId: string) => `character/${characterId}/item-use/buffs/refresh`,
};
