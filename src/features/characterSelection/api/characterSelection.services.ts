import type { CharacterCreationValues, CharacterSelectionDataType } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { CHARACTER_SELECTION_ROUTES } from "./characterSelection.routes";


export const characterSelectionDataRequest = async (): Promise<CharacterSelectionDataType> => {
    const request = await http.get<ApiResponse<CharacterSelectionDataType>>(
        CHARACTER_SELECTION_ROUTES.characterSelectionData())
    return request.data.data
}

export const createCharacterRequest = async (body:CharacterCreationValues) => {
    const request = await http.post<ApiResponse<CharacterSelectionDataType>>(
        CHARACTER_SELECTION_ROUTES.create(),body)
    return request.data.data
}