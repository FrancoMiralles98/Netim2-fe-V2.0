import { useEffect, useRef, useState } from "react";
import type { FightCharacterMobRequest, FightCharacterMobResponse } from "netim2-shared";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { fightMobRequest } from "../api/fight.services";

export const useStartFight = (characterId: string | undefined) => {
    const { runCharacterMutation } = useCharacterSession();
    const { showLoadingModal, closeLoadingModal, showErrorModal } = useModal();
    const pending = useRef(false);
    const currentCharacter = useRef(characterId);
    const [isPending, setIsPending] = useState(false);
    const [fight, setFight] = useState<{ characterId: string; response: FightCharacterMobResponse } | null>(null);

    useEffect(() => {
        currentCharacter.current = characterId;
        return () => { currentCharacter.current = undefined; };
    }, [characterId]);

    const startFight = async (body: FightCharacterMobRequest): Promise<boolean> => {
        if (!characterId || pending.current) return false;
        pending.current = true;
        setIsPending(true);
        showLoadingModal("Preparando pelea…");
        try {
            const response = await runCharacterMutation(characterId, () => fightMobRequest(characterId, body));
            if (currentCharacter.current !== characterId) return false;
            setFight({ characterId, response });
            return true;
        } catch (error) {
            if (currentCharacter.current === characterId) showErrorModal(error);
            return false;
        } finally {
            pending.current = false;
            setIsPending(false);
            closeLoadingModal();
        }
    };

    return {
        startFight,
        isPending,
        response: fight && fight.characterId === characterId ? fight.response : null,
        clearFight: () => setFight(null),
    };
};
