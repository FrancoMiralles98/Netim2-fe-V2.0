import type { DiscardInventoryItemRequest, DiscardInventoryItemResponse, MergeInventoryItemsRequest, MergeInventoryItemsResponse, MoveInventoryItemRequest, MoveInventoryItemResponse, SplitInventoryItemRequest, SplitInventoryItemResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { INVENTORY_ROUTES } from "./inventory.routes";

export const moveInventoryItemRequest = async (
    characterId: string,
    body: MoveInventoryItemRequest,
): Promise<MoveInventoryItemResponse> => {
    const response = await http.patch<ApiResponse<MoveInventoryItemResponse>>(
        INVENTORY_ROUTES.moveItem(characterId), body,
    );

    return response.data.data;
};

export const splitInventoryItemRequest = async (
    characterId: string,
    body: SplitInventoryItemRequest,
): Promise<SplitInventoryItemResponse> => {
    const response = await http.post<ApiResponse<SplitInventoryItemResponse>>(
        INVENTORY_ROUTES.splitItem(characterId), body,
    );

    return response.data.data;
};

export const mergeInventoryItemsRequest = async (
    characterId: string,
    body: MergeInventoryItemsRequest,
): Promise<MergeInventoryItemsResponse> => {
    const response = await http.post<ApiResponse<MergeInventoryItemsResponse>>(
        INVENTORY_ROUTES.mergeItems(characterId), body,
    );

    return response.data.data;
};

export const discardInventoryItemRequest = async (
    characterId: string,
    { itemId }: DiscardInventoryItemRequest,
): Promise<DiscardInventoryItemResponse> => {
    const response = await http.delete<ApiResponse<DiscardInventoryItemResponse>>(
        INVENTORY_ROUTES.discardItem(characterId, itemId),
    );

    return response.data.data;
};
