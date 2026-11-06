import type { CharacterSession, SelectCharacterSpecialityResponse } from "netim2-shared";

export const applySpecialitySelectionToCharacter = (
    character: CharacterSession,
    response: SelectCharacterSpecialityResponse,
): CharacterSession => ({
    ...character,
    especialidad: response.speciality,
    hab: response.skills,
    stats: response.stats,
    atributos: response.attributes,
});
