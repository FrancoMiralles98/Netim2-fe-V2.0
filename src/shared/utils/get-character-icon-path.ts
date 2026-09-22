import type {
    CharacterGenero,
    CharacterRace
} from "netim2-shared";

export const getCharacterIconPath = (
    race: CharacterRace,
    genero: CharacterGenero
): string => `/icons/character/${race}-${genero}-icon.png`;
