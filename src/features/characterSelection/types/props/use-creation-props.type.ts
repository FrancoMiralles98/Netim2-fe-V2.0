import type { CharacterSummary } from "netim2-shared";

export interface useCreationProps {
    addCharacter: (character: CharacterSummary) => void,
}