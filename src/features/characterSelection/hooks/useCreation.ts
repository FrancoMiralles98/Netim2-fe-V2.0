import { useEffect, useState } from "react"
import type { CharacterCreationValues } from "../types/character-creation-card.types"
import { useModal } from "../../../shared/modal/hooks/useModal"
import { creationCharacterSchema } from "../schema/creationCharacterSchema"
import { useUserSession } from "../../userSession/hook/useUserSession"
import type { CharacterRace } from "netim2-shared"

export const useCreation = () => {
    const [creationInstance, setCreationInstance] = useState<'select_raza' | 'select_reino'>('select_raza')
    const [characterCreationValues, setCharacterCreationValues] = useState<CharacterCreationValues>({})
    const [newAccount, setNewAccount] = useState(true)
    const modal = useModal()
    const { user } = useUserSession()

    const changeInstance = (instance: 'select_raza' | 'select_reino') => {
        setCreationInstance(instance)
    }

    useEffect(() => {
        if (!user) return;

        if (user.reino) {
            setNewAccount(false)
            setCharacterCreationValues((prev) => ({
                ...prev,
                reino: user.reino,
            }));
            return;
        }
    }, [user]);

    const handleCreateCharacter = async (
        nombre: string,
        genero: 'femenino' | 'masculino',
        raza: CharacterRace
    ) => {
        const validResult = verifyName(nombre)
        if (!validResult) return

        setCharacterCreationValues((prev) => ({
            ...prev, nombre, genero, raza
        }))
        if (newAccount) {
            setCreationInstance('select_reino')
            return
        }
        await createCharacter(nombre)
    }

    const verifyName = (nombre?: string): boolean => {
        const nombreToVerify = nombre ? nombre : characterCreationValues.nombre
        const verifyResult = creationCharacterSchema.safeParse({ nombre: nombreToVerify })
        if (!verifyResult.success) {
            const errors = verifyResult.error.issues.map(issue => issue.message)
            modal.showFeedBackModal({
                title: 'Error al Crear el personjae',
                messages: errors,
                onAccept: modal.closeModal
            })
            return false
        }
        return true
    }

    const createCharacter = async (nombre?: string) => {
        try {
            const validResult = verifyName(nombre)
            if (!validResult) return

        } catch (error) {
            modal.showErrorModal(error)
        }
    }


    return {
        creationInstance,
        changeInstance,
        newAccount,
        handleCreateCharacter
    }
}