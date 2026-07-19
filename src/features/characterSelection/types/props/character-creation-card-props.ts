import type { CharacterGenero, CharacterRace, RaceInfo } from "netim2-shared";

export interface CharacterCreationCardProps {
    isActive: boolean,
    raceInfo: RaceInfo,
    attributeLimit: number,
    handleCreateCharacter: (nombre: string, genero: CharacterGenero, raza: CharacterRace) => void
}