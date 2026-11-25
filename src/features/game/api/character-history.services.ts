import type { GetHistorialListRequest, GetHistorialListResponse, GetHistorialRequest, GetHistorialResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { CHARACTER_HISTORY_ROUTES } from "./character-history.routes";
import type { ClaimHistoryRewardsRequest, ClaimCharacterHistoryRewardsResponse } from "netim2-shared";

export const claimCharacterHistoryRewardsRequest = async (
    characterId: string,
    body: ClaimHistoryRewardsRequest,
): Promise<ClaimCharacterHistoryRewardsResponse> => {
    const response = await http.post<ApiResponse<ClaimCharacterHistoryRewardsResponse>>(
        CHARACTER_HISTORY_ROUTES.claim(characterId), body,
    );
    return response.data.data;
};

export const getCharacterHistoryRequest = async (
    characterId: string,
    query: GetHistorialListRequest,
    signal: AbortSignal,
): Promise<GetHistorialListResponse> => {
    const response = await http.get<ApiResponse<GetHistorialListResponse>>(
        CHARACTER_HISTORY_ROUTES.list(characterId), { params: query, signal },
    );
    return response.data.data;
};

export const getCharacterHistoryDetailRequest = async (
    characterId: string,
    request: GetHistorialRequest,
    signal: AbortSignal,
): Promise<GetHistorialResponse> => {
    const response = await http.get<ApiResponse<GetHistorialResponse>>(
        CHARACTER_HISTORY_ROUTES.detail(characterId, request.historialId), { signal },
    );
    return response.data.data;
};
