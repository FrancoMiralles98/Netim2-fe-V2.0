import type { CharacterRace, CharacterSession, CharacterSpeciality, GameConfigResponse } from "netim2-shared"
import { http } from "../../../api/http"
import type { ApiResponse } from "../../../api/types/api-response.type"
import { CHARACTER_SESSION_ROUTES } from "./character-session.routes"

export const getCharacterSessionRequest = async (characterId: string): Promise<CharacterSession> => {
    const request = await http.get<ApiResponse<CharacterSession>>(
        CHARACTER_SESSION_ROUTES.getCharacterSession(characterId))

    return request.data.data
}

export const getGameConfigRequest = async (race: CharacterRace, speciality?: CharacterSpeciality): Promise<GameConfigResponse> => {
    const response = await http.get<ApiResponse<GameConfigResponse>>(
        CHARACTER_SESSION_ROUTES.getGameConfig(), {
            params: { race, ...(speciality ? { speciality } : {}) },
        })

    return response.data.data
}
