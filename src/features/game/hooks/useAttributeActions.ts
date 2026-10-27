import { useRef, useState } from "react";
import type { CharacterSession, IncreaseCharacterAttributeRequest } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { increaseCharacterAttributeRequest } from "../api/attribute.services";

export const useAttributeActions = (character: Pick<CharacterSession, "id" | "puntos_atributos">) => {
    const { applyAttributeIncreaseResponse, runCharacterMutation } = useCharacterSession();
    const modal = useModal();
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);

    const increaseAttribute = async (attribute: IncreaseCharacterAttributeRequest["attribute"]) => {
        if (pending.current || character.puntos_atributos < 1) return;
        pending.current = true;
        setIsPending(true);

        try {
            await runCharacterMutation(character.id, async () => {
                const response = await increaseCharacterAttributeRequest(character.id, { attribute });
                applyAttributeIncreaseResponse(character.id, response);
            });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            pending.current = false;
            setIsPending(false);
        }
    };

    return { increaseAttribute, isPending };
};
