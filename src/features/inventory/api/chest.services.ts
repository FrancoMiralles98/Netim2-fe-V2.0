import type { OpenChestBulkRequest, OpenChestBulkResponse, OpenChestRequest, OpenChestResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { CHEST_ROUTES } from "./chest.routes";

export const openChestRequest = async (
    characterId: string,
    body: OpenChestRequest,
): Promise<OpenChestResponse> => {
    const response = await http.post<ApiResponse<OpenChestResponse>>(
        CHEST_ROUTES.open(characterId), body,
    );
    return response.data.data;
};

export const openChestBulkRequest = async (
    characterId: string,
    body: OpenChestBulkRequest,
): Promise<OpenChestBulkResponse> => {
    const response = await http.post<ApiResponse<OpenChestBulkResponse>>(
        CHEST_ROUTES.openBulk(characterId), body,
    );
    return response.data.data;
};
