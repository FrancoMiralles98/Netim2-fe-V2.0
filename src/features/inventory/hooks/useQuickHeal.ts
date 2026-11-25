import { useEffect, useRef, useState } from "react";
import type { QuickHealRequest } from "netim2-shared";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { quickHealRequest } from "../api/potion.services";
import { getResourcesWithoutPotions } from "../potion-restoration";

export const useQuickHeal = () => {
    const { character, runCharacterMutation, applyPotionUseResponse } = useCharacterSession();
    const modal = useModal();
    const latestCharacter = useRef(character);
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        latestCharacter.current = character;
    }, [character]);

    const heal = async (characterId: string) => {
        if (pending.current) return;
        pending.current = true;
        setIsPending(true);
        modal.closeModal();
        modal.showLoadingModal("Recuperando vida y maná...");

        try {
            await runCharacterMutation(characterId, async () => {
                const current = latestCharacter.current;
                if (!current || current.id !== characterId) return;

                const resources: QuickHealRequest["resources"] = [];
                if (current.stats.general.hp.actual < current.stats.general.hp.max) resources.push("hp");
                if (current.stats.general.mana.actual < current.stats.general.mana.max) resources.push("mana");
                if (resources.length === 0) {
                    modal.showNotificationModal({ title: "Tu vida y maná ya están al máximo." });
                    return;
                }

                const missingResources = getResourcesWithoutPotions(current.inventario, resources);
                if (missingResources.length > 0) {
                    const resourceNames = missingResources.map(resource => resource === "hp" ? "vida" : "maná");
                    modal.showNotificationModal({
                        title: `No tienes pociones disponibles para recuperar ${resourceNames.join(" y ")}.`,
                    });
                    return;
                }

                const response = await quickHealRequest(characterId, { resources });
                applyPotionUseResponse(characterId, response);
            });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            modal.closeLoadingModal();
            pending.current = false;
            setIsPending(false);
        }
    };

    const confirmQuickHeal = () => {
        if (!character || pending.current) return;
        modal.showActionModal({
            title: "Curación rápida de vida y maná",
            subTitle: "Esta acción usará las pociones de menor a mayor recuperación para restablecer toda tu vida y maná. Solo se consumirán para los recursos que necesites recuperar.",
            acceptText: "Recuperar",
            onAccept: () => { void heal(character.id); },
        });
    };

    return { confirmQuickHeal, isPending };
};
