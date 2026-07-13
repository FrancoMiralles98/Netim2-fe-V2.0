import type { CharacterSummary, RaceInfo } from "netim2-shared";

export interface CharacterSelectionDataType {
    characters: CharacterSummary[]
    races: RaceInfo[];
    attributeLimit: number;
}
