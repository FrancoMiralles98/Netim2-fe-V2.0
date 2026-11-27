import type { GetShopItemsRequest, GetShopItemsResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { SHOP_ROUTES } from "./shop.routes";
import type { BuyShopItemRequest, BuyShopItemResponse, NpcShopId } from "netim2-shared";
import type { SellShopItemRequest, SellShopItemResponse } from "netim2-shared";

export const sellShopItemRequest = async (
    shopId: NpcShopId,
    characterId: string,
    body: SellShopItemRequest,
): Promise<SellShopItemResponse> => {
    const response = await http.post<ApiResponse<SellShopItemResponse>>(
        SHOP_ROUTES.sell(shopId, characterId), body,
    );
    return response.data.data;
};

export const buyShopItemRequest = async (
    shopId: NpcShopId,
    characterId: string,
    body: BuyShopItemRequest,
): Promise<BuyShopItemResponse> => {
    const response = await http.post<ApiResponse<BuyShopItemResponse>>(
        SHOP_ROUTES.buy(shopId, characterId), body,
    );
    return response.data.data;
};

export const getShopItemsRequest = async (
    request: GetShopItemsRequest,
    signal: AbortSignal,
): Promise<GetShopItemsResponse> => {
    const response = await http.get<ApiResponse<GetShopItemsResponse>>(
        SHOP_ROUTES.items(request), { signal },
    );
    return response.data.data;
};
