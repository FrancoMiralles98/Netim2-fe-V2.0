import { useModal } from "../../../shared/modal/hooks/useModal";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useEffect, useRef } from "react";

export const useGameGuard = () => {
  const {
    character,
    isConnected,
    isReady,
    worldSessionId,
    sessionEndReason,
    leaveGameToCharacterSelection,
    leaveGame
  } = useCharacterSession();

  const modal = useModal();
  const sessionEndModalShown = useRef(false);

  const gameReady = Boolean(
    character &&
    isConnected &&
    isReady &&
    worldSessionId &&
    !sessionEndReason,
  );

  useEffect(() => {
    if (!sessionEndReason) {
      sessionEndModalShown.current = false;
      return;
    }

    if (sessionEndModalShown.current) return;

    sessionEndModalShown.current = true;

    modal.closeLoadingModal();

    modal.showNotificationModal({
      title: 'Sesión reemplazada, Tu cuenta se conectó con otro personaje. Serás devuelto a la selección de personaje.',
      onClickButton: () => {
        leaveGame();
      },
    });
  }, [sessionEndReason, modal, leaveGameToCharacterSelection]);

  useEffect(() => {
    if (!character) return;

    // Si la sesión terminó por reemplazo/expiración, no muestres loading.
    if (sessionEndReason) return;

    if (!isConnected || !isReady || !worldSessionId) {
      modal.showLoadingModal('Conectando con el mundo...');
      return;
    }

    modal.closeLoadingModal();
  }, [
    character,
    isConnected,
    isReady,
    worldSessionId,
    sessionEndReason,
    modal,
  ]);

  return {
    character,
    isConnected,
    isReady,
    worldSessionId,
    sessionEndReason,
    gameReady,
    leaveGameToCharacterSelection,
  };
};