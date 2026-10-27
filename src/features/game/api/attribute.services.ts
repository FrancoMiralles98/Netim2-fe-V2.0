import type { IncreaseCharacterAttributeRequest, IncreaseCharacterAttributeResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { ATTRIBUTE_ROUTES } from "./attribute.routes";

export const increaseCharacterAttributeRequest = async (
    characterId: string,
    body: IncreaseCharacterAttributeRequest,
): Promise<IncreaseCharacterAttributeResponse> => {
    const response = await http.post<ApiResponse<IncreaseCharacterAttributeResponse>>(
        ATTRIBUTE_ROUTES.increase(characterId), body,
    );
    return response.data.data;
};
