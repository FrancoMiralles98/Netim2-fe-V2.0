import type { ApplyBuffRequest, ApplyBuffResponse, RefreshBuffsResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { BUFF_ROUTES } from "./buff.routes";

export const applyBuffRequest = async (
    characterId: string,
    body: ApplyBuffRequest,
): Promise<ApplyBuffResponse> => {
    const response = await http.post<ApiResponse<ApplyBuffResponse>>(
        BUFF_ROUTES.apply(characterId), body,
    );
    return response.data.data;
};

export const refreshBuffsRequest = async (characterId: string): Promise<RefreshBuffsResponse> => {
    const response = await http.post<ApiResponse<RefreshBuffsResponse>>(
        BUFF_ROUTES.refresh(characterId),
    );
    return response.data.data;
};
