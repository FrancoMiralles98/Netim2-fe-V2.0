import type { CharacterSession, CharacterSummary, EquipItemResponse, MoveInventoryItemResponse } from "netim2-shared";
import type { SessionEndReason } from "./session-end-reason.type";


export interface CharacterSessionContextValue {
    character: CharacterSession | null
    isReady: boolean;
    sessionEndReason: SessionEndReason
    isConnected: boolean;
    worldSessionId: string | null
    enterGame: (character: CharacterSummary) => Promise<void>
    updateInventoryItemPosition: (characterId: string, movedItem: MoveInventoryItemResponse) => void
    applyEquipmentResponse: (characterId: string, response: EquipItemResponse) => void
    leaveGame: () => void
    leaveGameToCharacterSelection: () => void

}
