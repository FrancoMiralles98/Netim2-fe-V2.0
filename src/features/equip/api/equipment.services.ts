import type { BuyEquipmentSlotRequest, BuyEquipmentSlotResponse, EquipItemRequest, EquipItemResponse, SelectEquipmentRequest, SelectEquipmentResponse, UnequipItemRequest, UnequipItemResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { EQUIPMENT_ROUTES } from "./equipment.routes";

export const equipItemRequest = async (
    characterId: string,
    body: EquipItemRequest,
): Promise<EquipItemResponse> => {
    const response = await http.post<ApiResponse<EquipItemResponse>>(
        EQUIPMENT_ROUTES.equipItem(characterId), body,
    );
    return response.data.data;
};

export const unequipItemRequest = async (
    characterId: string,
    body: UnequipItemRequest,
): Promise<UnequipItemResponse> => {
    const response = await http.post<ApiResponse<UnequipItemResponse>>(
        EQUIPMENT_ROUTES.unequipItem(characterId), body,
    );
    return response.data.data;
};

export const buyEquipmentSlotRequest = async (
    characterId: string,
    body: BuyEquipmentSlotRequest,
): Promise<BuyEquipmentSlotResponse> => {
    const response = await http.post<ApiResponse<BuyEquipmentSlotResponse>>(
        EQUIPMENT_ROUTES.buyEquipmentSlot(characterId), body,
    );
    return response.data.data;
};

export const selectEquipmentSlotRequest = async (
    characterId: string,
    body: SelectEquipmentRequest,
): Promise<SelectEquipmentResponse> => {
    const response = await http.patch<ApiResponse<SelectEquipmentResponse>>(
        EQUIPMENT_ROUTES.selectEquipmentSlot(characterId), body,
    );
    return response.data.data;
};
