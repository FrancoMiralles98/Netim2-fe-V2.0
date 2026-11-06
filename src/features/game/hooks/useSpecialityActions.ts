import { useRef, useState } from "react";
import type { CharacterSession, SelectCharacterSpecialityRequest } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { selectCharacterSpecialityRequest } from "../api/character-skills.services";
import { MIN_SPECIALITY_LEVEL } from "../skills.constants";

export const useSpecialityActions = (character: Pick<CharacterSession, "id" | "lv" | "especialidad">) => {
    const { runCharacterMutation, applySpecialitySelectionResponse } = useCharacterSession();
    const modal = useModal();
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);

    const selectSpeciality = async (speciality: SelectCharacterSpecialityRequest["speciality"]) => {
        if (pending.current || character.lv < MIN_SPECIALITY_LEVEL || character.especialidad) return;

        pending.current = true;
        setIsPending(true);
        modal.showLoadingModal("Eligiendo especialidad...");
        try {
            await runCharacterMutation(character.id, async () => {
                const response = await selectCharacterSpecialityRequest(character.id, { speciality });
                applySpecialitySelectionResponse(character.id, response);
            });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            modal.closeLoadingModal();
            pending.current = false;
            setIsPending(false);
        }
    };

    return { selectSpeciality, isPending };
};
