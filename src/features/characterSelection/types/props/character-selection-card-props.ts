import type { CharacterSummary } from "netim2-shared";

export interface CharacterSelectionCardProps {
    character: CharacterSummary,
    isActive: boolean,
    maxAttributeValue: number,
    handleDeleteCharacter: (character: CharacterSummary) => void
}