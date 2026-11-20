import type { FightCharacterMobRequest, CharacterFightResultResponse, FightResponse } from "netim2-shared"
import { http } from "../../../api/http"
import type { ApiResponse } from "../../../api/types/api-response.type"
import { FIGHT_ROUTES } from "./fight.routes"

export const fightMobRequest = async (
    characterId: string,
    body: FightCharacterMobRequest,
): Promise<CharacterFightResultResponse> => {
    const response = await http.post<ApiResponse<CharacterFightResultResponse>>(FIGHT_ROUTES.fightMob(characterId), body);
    return response.data.data;
};

export const fightLabRequest = async() => {
    const request = await http.get<ApiResponse<FightResponse>>(FIGHT_ROUTES.fightLab())

    return request.data.data
}
