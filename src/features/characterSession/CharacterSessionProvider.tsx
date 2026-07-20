import { useCallback, useRef, useState, type ReactNode } from "react";
import { CharacterSessionContext } from "./context/character-session.context";
import { useGameSocket } from "../../api/hooks/use-game-socket";
import { useNavigate } from "react-router";
import { RouterPaths } from "../../app/router/router-paths.types";
import { useModal } from "../../shared/modal/hooks/useModal";
import type { CharacterSession, CharacterSummary } from "netim2-shared";
import { getCharacterSessionRequest } from "./api/character-session.services";
import type { SessionEndReason } from "./types/session-end-reason.type";

export const CharacterSessionProvider = ({ children }: { children: ReactNode }) => {

    const [character, setCharacter] = useState<CharacterSession | null>(null)
    const navigate = useNavigate()
    const [sessionEndReason, setSessionEndReason] = useState<SessionEndReason>(null);
    const loading = useRef(false)
    const modal = useModal()

    const enterGame = async (characterSummary: CharacterSummary) => {
        if (loading.current) return
        try {
            setSessionEndReason(null);
            loading.current = true
            modal.showLoadingModal('Cargando mundo...')
            const data = await getCharacterSessionRequest(characterSummary.id)
            setCharacter(data)
            modal.closeLoadingModal()
        } catch (error) {
            modal.closeLoadingModal()
            modal.showErrorModal(error)
        } finally {
            loading.current = false
        }
    }

    const handleSessionReplaced = () => {
        setSessionEndReason('replaced');
        modal.closeLoadingModal();

        modal.showNotificationModal({
            title: 'Sesión reemplazada, Tu cuenta se conectó con otro personaje. Serás devuelto a la selección de personaje.',
            onClickButton: () => {
                setCharacter(null);
                setSessionEndReason(null);
                navigate(RouterPaths.CHARACTER_SELECTION, { replace: true });
            },
        });

    }

    const { disconnect, isConnected, isReady, worldSessionId } = useGameSocket({ characterId: character?.id, onSessionReplaced: handleSessionReplaced })

    const leaveGame = useCallback(() => {
        disconnect();
        setCharacter(null);
        setSessionEndReason(null);
        navigate(RouterPaths.LANDING_PAG, { replace: true });
    }, [disconnect, navigate]);

    const leaveGameToCharacterSelection = useCallback(() => {
        disconnect();
        setCharacter(null);
        setSessionEndReason(null);
        navigate(RouterPaths.CHARACTER_SELECTION, { replace: true });
    }, [disconnect, navigate]);

    return (
        <CharacterSessionContext.Provider value={{
            character,
            enterGame,
            isConnected,
            sessionEndReason,
            isReady,
            leaveGame,
            worldSessionId,
            leaveGameToCharacterSelection

        }}>
            {children}
        </CharacterSessionContext.Provider>
    )
}