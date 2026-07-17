import type { CharacterSelectionDataType, CharacterSummary } from "netim2-shared";
import type { CharacterSelectionType } from "../character-selection.type";

export interface CreationProps {
    changeType: (typeToChange: CharacterSelectionType) => void,
    characterCreationConfig: CharacterSelectionDataType | null,
    addCharacter: (character: CharacterSummary) => void
}