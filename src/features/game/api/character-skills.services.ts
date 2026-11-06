import type { GetCharacterSpecialitySkillsRequest, GetCharacterSpecialitySkillsResponse, SelectCharacterSpecialityRequest, SelectCharacterSpecialityResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { CHARACTER_SKILLS_ROUTES } from "./character-skills.routes";
import type { UpgradeCharacterSkillRequest, UpgradeCharacterSkillResponse } from "netim2-shared";

export const upgradeCharacterSkillRequest = async (characterId: string, body: UpgradeCharacterSkillRequest): Promise<UpgradeCharacterSkillResponse> => {
    const response = await http.post<ApiResponse<UpgradeCharacterSkillResponse>>(CHARACTER_SKILLS_ROUTES.upgrade(characterId), body);
    return response.data.data;
};
import type { GetSkillUpgradePreviewRequest, GetSkillUpgradePreviewResponse } from "netim2-shared";

export const getSkillUpgradePreviewRequest = async (
    characterId: string, body: GetSkillUpgradePreviewRequest,
): Promise<GetSkillUpgradePreviewResponse> => {
    const response = await http.post<ApiResponse<GetSkillUpgradePreviewResponse>>(
        CHARACTER_SKILLS_ROUTES.upgradePreview(characterId), body,
    );
    return response.data.data;
};

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

export const selectCharacterSpecialityRequest = async (
    characterId: string,
    body: SelectCharacterSpecialityRequest,
): Promise<SelectCharacterSpecialityResponse> => {
    const response = await http.post<ApiResponse<SelectCharacterSpecialityResponse>>(
        CHARACTER_SKILLS_ROUTES.selectSpeciality(characterId),
        body,
    );

    return response.data.data;
};
