import type { ClaimMissionRequest, ClaimMissionResponse, MissionListResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { CHARACTER_MISSIONS_ROUTES } from "./character-missions.routes";

export const getCharacterMissionsRequest = async (characterId: string, signal: AbortSignal): Promise<MissionListResponse> => {
    const response = await http.get<ApiResponse<MissionListResponse>>(
        CHARACTER_MISSIONS_ROUTES.list(characterId),
        { signal },
    );
    return response.data.data;
};

export const claimCharacterMissionRequest = async (characterId: string, body: ClaimMissionRequest): Promise<ClaimMissionResponse> => {
    const response = await http.post<ApiResponse<ClaimMissionResponse>>(
        CHARACTER_MISSIONS_ROUTES.claim(characterId),
        body,
    );
    return response.data.data;
};
