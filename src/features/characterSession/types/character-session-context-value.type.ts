import type { CharacterSession } from "netim2-shared";
import type { SessionEndReason } from "./session-end-reason.type";


export interface CharacterSessionContextValue {
    character: CharacterSession | null
    isReady: boolean;
    sessionEndReason: SessionEndReason
    isConnected: boolean;
    worldSessionId: string | null
    enterGame: (character: CharacterSession) => void
    leaveGame: () => void
    leaveGameToCharacterSelection: () => void

}