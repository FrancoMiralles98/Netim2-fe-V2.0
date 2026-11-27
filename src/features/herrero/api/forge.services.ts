import type { PreviewForgeUpgradeRequest, PreviewForgeUpgradeResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";

export const previewForgeUpgradeRequest = async (
    characterId: string,
    body: PreviewForgeUpgradeRequest,
    signal: AbortSignal,
): Promise<PreviewForgeUpgradeResponse> => {
    const response = await http.post<ApiResponse<PreviewForgeUpgradeResponse>>(
        `npc/herrero/characters/${encodeURIComponent(characterId)}/preview`, body, { signal },
    );
    return response.data.data;
};
