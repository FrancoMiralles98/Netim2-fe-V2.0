import type { CharacterSelectionDataType, CharacterSummary } from "netim2-shared";
import type { CharacterSelectionType } from "../character-selection.type";

export interface SelectionProps {
    changeType: (typeToChange: CharacterSelectionType) => void,
    characters: CharacterSummary[],
    characterCreationConfig: CharacterSelectionDataType,
    deleteCharacter: (nombre: string) => void
}