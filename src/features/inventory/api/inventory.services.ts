import type { EquipItemRequest, EquipItemResponse, MoveInventoryItemRequest, MoveInventoryItemResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { INVENTORY_ROUTES } from "./inventory.routes";

export const equipInventoryItemRequest = async (
    characterId: string,
    body: EquipItemRequest,
): Promise<EquipItemResponse> => {
    const response = await http.post<ApiResponse<EquipItemResponse>>(
        INVENTORY_ROUTES.equipItem(characterId), body,
    );
    return response.data.data;
};

export const moveInventoryItemRequest = async (
    characterId: string,
    body: MoveInventoryItemRequest,
): Promise<MoveInventoryItemResponse> => {
    const response = await http.patch<ApiResponse<MoveInventoryItemResponse>>(
        INVENTORY_ROUTES.moveItem(characterId), body,
    );

    return response.data.data;
};
