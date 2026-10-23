import type { UsePotionRequest, UsePotionResponse, UseReservePotionRequest, UseReservePotionResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { POTION_ROUTES } from "./potion.routes";

export const activatePotionRequest = async (
    characterId: string,
    body: UsePotionRequest,
): Promise<UsePotionResponse> => {
    const response = await http.post<ApiResponse<UsePotionResponse>>(
        POTION_ROUTES.activate(characterId), body,
    );
    return response.data.data;
};

export const activateReservePotionRequest = async (
    characterId: string,
    body: UseReservePotionRequest,
): Promise<UseReservePotionResponse> => {
    const response = await http.post<ApiResponse<UseReservePotionResponse>>(
        POTION_ROUTES.activateReserve(characterId), body,
    );
    return response.data.data;
};
