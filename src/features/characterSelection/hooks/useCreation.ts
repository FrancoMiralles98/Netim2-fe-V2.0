import { useEffect, useState } from "react"
import type { CharacterCreationValues } from "../types/character-creation-card.types"
import { useModal } from "../../../shared/modal/hooks/useModal"
import { creationCharacterSchema } from "../schema/creationCharacterSchema"
import { useUserSession } from "../../userSession/hook/useUserSession"

export const useCreation = () => {
    const [creationInstance, setCreationInstance] = useState<'select_raza' | 'select_reino'>('select_reino')
    const [characterCreationValues, setCharacterCreationValues] = useState<CharacterCreationValues>({})
    const modal = useModal()
    const { user } = useUserSession()

    const changeInstance = (instance: 'select_raza' | 'select_reino') => {
        setCreationInstance(instance)
    }

    useEffect(() => {
        if (!user) return;

        if (user.reino) {
            setCreationInstance('select_raza');
            setCharacterCreationValues((prev) => ({
                ...prev,
                reino: user.reino,
            }));
            return;
        }

        setCreationInstance('select_reino');
    }, [user]);

    const createCharacter = async (nombre: string) => {
        try {
            const verifyResult = creationCharacterSchema.safeParse({ nombre })
            if (!verifyResult.success) {
                const errors = verifyResult.error.issues.map(issue => issue.message)
                modal.showFeedBackModal({
                    title: 'Error al Crear el personjae',
                    messages: errors,
                    onAccept: modal.closeModal
                })
                return
            }

        } catch (error) {
            modal.showErrorModal(error)
        }
    }


    return {
        creationInstance,
        changeInstance
    }
}