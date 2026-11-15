import type { GetMobsByUbicationRequest, GetMobsByUbicationResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { EXPLORE_ROUTES } from "./explore.routes";

export const getMobsByUbicationRequest = async (
    params: GetMobsByUbicationRequest,
    signal: AbortSignal,
): Promise<GetMobsByUbicationResponse> => {
    const response = await http.get<ApiResponse<GetMobsByUbicationResponse>>(
        EXPLORE_ROUTES.mobsByUbication(),
        { params, signal },
    );
    return response.data.data;
};
