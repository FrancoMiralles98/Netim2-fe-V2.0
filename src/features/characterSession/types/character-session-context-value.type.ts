import type { CharacterSession, CharacterSummary } from "netim2-shared";
import type { SessionEndReason } from "./session-end-reason.type";


export interface CharacterSessionContextValue {
    character: CharacterSession | null
    isReady: boolean;
    sessionEndReason: SessionEndReason
    isConnected: boolean;
    worldSessionId: string | null
    enterGame: (character: CharacterSummary) => Promise<void>
    leaveGame: () => void
    leaveGameToCharacterSelection: () => void

}