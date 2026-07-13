import { http } from "../../../api/http";
import type { CharacterCreationValues } from "../types/character-creation-card.types";
import { CHARACTER_SELECTION_ROUTES } from "./characterSelection.routes";

export const createCharacterRequest = async (body:CharacterCreationValues) => {
    const request = await http.post(CHARACTER_SELECTION_ROUTES.create(),body)
}