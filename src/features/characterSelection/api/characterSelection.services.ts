import type { CharacterCreationValues, CharacterSelectionDataType, CharacterSummary } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { CHARACTER_SELECTION_ROUTES } from "./characterSelection.routes";


export const characterSelectionDataRequest = async (): Promise<CharacterSelectionDataType> => {
    const request = await http.get<ApiResponse<CharacterSelectionDataType>>(
        CHARACTER_SELECTION_ROUTES.characterSelectionData())
    return request.data.data
}

export const createCharacterRequest = async (body: CharacterCreationValues): Promise<CharacterSummary> => {
    const request = await http.post<ApiResponse<CharacterSummary>>(
        CHARACTER_SELECTION_ROUTES.create(), body)
    return request.data.data
}

export const deleteCharacterRequest = async (characterId: string): Promise<boolean> => {
    const request = await http.delete<ApiResponse<boolean>>(
        CHARACTER_SELECTION_ROUTES.delete(characterId))
    return request.data.data
}