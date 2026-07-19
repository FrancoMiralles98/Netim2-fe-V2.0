import type { CharacterSession } from "./character-session.types";


export interface CharacterSessionContextValue {
    character: CharacterSession | null
    isReady: boolean;
    isConnected: boolean;
    worldSessionId: string | null
    enterGame: (character: CharacterSession) => void
    leaveGame: () => void
    leaveGameToCharacterSelection: () => void

}