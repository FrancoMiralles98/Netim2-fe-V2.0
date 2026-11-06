import { useRef, useState } from "react";
import type { SkillType } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { upgradeCharacterSkillRequest } from "../api/character-skills.services";

export const useSkillUpgradeActions = () => {
    const { character, runCharacterMutation, applySkillUpgradeResponse } = useCharacterSession();
    const modal = useModal();
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);
    const upgrade = async (skillId: SkillType['id']) => {
        if (!character || pending.current) return;
        pending.current = true;
        setIsPending(true);
        modal.showLoadingModal("Mejorando habilidad...");
        try {
            await runCharacterMutation(character.id, async () => {
                const response = await upgradeCharacterSkillRequest(character.id, { skillId });
                applySkillUpgradeResponse(character.id, response);
            });
        } catch (error) { modal.showErrorModal(error); }
        finally { modal.closeLoadingModal(); pending.current = false; setIsPending(false); }
    };
    return { upgrade, isPending };
};
