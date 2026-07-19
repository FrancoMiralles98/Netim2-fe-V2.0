import type { ReinosBuffType, ReinosNames } from "netim2-shared";
import type { CharacterSelectionType } from "../character-selection.type";

export interface ReinoSelectionProps {
    createCharacter: (reino: ReinosNames) => void,
    changeType: (type: CharacterSelectionType) => void,
    reinoBuff: ReinosBuffType
}