import type { CharacterGenero, CharacterRace, RaceInfo } from "netim2-shared";
import type { CharacterSelectionType } from "../character-selection.type";

export interface CharacterCreationProps {
    changeType: (type: CharacterSelectionType) => void,
    races: RaceInfo[],
    attributeLimit: number,
    handleCreateCharacter: (nombre: string, genero: CharacterGenero, raza: CharacterRace) => Promise<boolean>,
    newAccount: boolean
}