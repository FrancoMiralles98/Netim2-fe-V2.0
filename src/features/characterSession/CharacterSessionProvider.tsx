import { useState, type ReactNode } from "react";
import { CharacterSessionContext } from "./context/character-session.context";
import { useGameSocket } from "../../api/hooks/use-game-socket";
import type { CharacterSession } from "./types/character-session.types";
import { useNavigate } from "react-router";
import { RouterPaths } from "../../app/router/router-paths.types";

export const CharacterSessionProvider = ({ children }: { children: ReactNode }) => {

    const [character, setCharacter] = useState<CharacterSession | null>(null)
    const { disconnect, isConnected, isReady, worldSessionId } = useGameSocket(character?.id)
    const navigate = useNavigate()

    const enterGame = (characterToConnect: CharacterSession) => {
        setCharacter(characterToConnect)
    }

    const leaveGame = () => {
        disconnect();
        setCharacter(null);
        navigate(RouterPaths.LANDING_PAG, { replace: true })
    };

    const leaveGameToCharacterSelection = () => {
        disconnect();
        setCharacter(null);
        navigate(RouterPaths.CHARACTER_SELECTION, { replace: true })
    };

    return (
        <CharacterSessionContext.Provider value={{
            character,
            enterGame,
            isConnected,
            isReady,
            leaveGame,
            worldSessionId,
            leaveGameToCharacterSelection

        }}>
            {children}
        </CharacterSessionContext.Provider>
    )
}