import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import type { CharacterSelectionDataType } from "../../../shared/types/backend/gameData/character-selection-data.types";
import { CHARACTER_SELECTION_ROUTES } from "./characterSelection.routes";


export const characterSelectionDataRequest = async (): Promise<CharacterSelectionDataType> => {
    const request = await http.get<ApiResponse<CharacterSelectionDataType>>(
        CHARACTER_SELECTION_ROUTES.characterSelectionData())
    return request.data.data
}