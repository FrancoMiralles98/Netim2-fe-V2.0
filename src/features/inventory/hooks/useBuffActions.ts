import { useRef, useState } from "react";
import type { ApplyBuffRequest, CharacterSession } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { applyBuffRequest } from "../api/buff.services";

export const useBuffActions = (character: Pick<CharacterSession, "id">) => {
    const { applyBuffResponse, runCharacterMutation } = useCharacterSession();
    const modal = useModal();
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);

    const applyBuff = async (body: ApplyBuffRequest) => {
        if (pending.current) return;
        pending.current = true;
        setIsPending(true);

        try {
            await runCharacterMutation(character.id, async () => {
                const response = await applyBuffRequest(character.id, body);
                applyBuffResponse(character.id, response);
            });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            pending.current = false;
            setIsPending(false);
        }
    };

    return { applyBuff, isPending };
};
