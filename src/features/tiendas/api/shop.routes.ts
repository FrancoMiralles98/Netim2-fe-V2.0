import type { GetShopItemsRequest, NpcShopId } from "netim2-shared";

export const SHOP_ROUTES = {
    items: ({ shopId }: GetShopItemsRequest) => `npc/shops/${encodeURIComponent(shopId)}/items`,
    buy: (shopId: NpcShopId, characterId: string) => `npc/shops/${encodeURIComponent(shopId)}/characters/${encodeURIComponent(characterId)}/buy`,
    sell: (shopId: NpcShopId, characterId: string) => `npc/shops/${encodeURIComponent(shopId)}/characters/${encodeURIComponent(characterId)}/sell`,
};
