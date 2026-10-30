import type { GetCharacterSpecialitySkillsRequest, GetCharacterSpecialitySkillsResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { CHARACTER_SKILLS_ROUTES } from "./character-skills.routes";

export const getCharacterSpecialitySkillsRequest = async (
    characterId: string,
    body: GetCharacterSpecialitySkillsRequest,
): Promise<GetCharacterSpecialitySkillsResponse> => {
    const response = await http.post<ApiResponse<GetCharacterSpecialitySkillsResponse>>(
        CHARACTER_SKILLS_ROUTES.specialityPreview(characterId),
        body,
    );

    return response.data.data;
};
