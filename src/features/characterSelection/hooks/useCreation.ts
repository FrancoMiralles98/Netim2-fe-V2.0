import { useRef, useState } from "react"
import type { CharacterCreationValues } from "../types/character-creation-card.types"
import { useModal } from "../../../shared/modal/hooks/useModal"
import { creationCharacterSchema } from "../schema/creationCharacterSchema"
import { useUserSession } from "../../userSession/hook/useUserSession"
import type { CharacterRace, ReinosNames } from "netim2-shared"
import { createCharacterRequest } from "../api/characterSelection.services"
import type { useCreationProps } from "../types/props/use-creation-props.type"

export const useCreation = ({ addCharacter }: useCreationProps) => {
    const [creationInstance, setCreationInstance] = useState<'select_raza' | 'select_reino'>('select_raza')
    const [characterCreationValues, setCharacterCreationValues] = useState<CharacterCreationValues>({})
    const loading = useRef(false)
    const modal = useModal()
    const { user, updateUserData } = useUserSession()
    const newAccount = !user?.reino;
    const accountReino = user?.reino;

    const changeInstance = (instance: 'select_raza' | 'select_reino') => {
        setCreationInstance(instance)
    }

    const handleCreateCharacter = async (
        nombre: string,
        genero: 'femenino' | 'masculino',
        raza: CharacterRace
    ): Promise<boolean> => {
        const validResult = verifyName(nombre)
        if (!validResult){
            return false
        }

        setCharacterCreationValues((prev) => ({
            ...prev, nombre, genero, raza
        }))
        if (newAccount) {
            setCreationInstance('select_reino')
            return true
        }

        await createCharacter(nombre, genero, raza)
        return true
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

    const createCharacterAfterReinoSeleciton = async (reino: ReinosNames) => {
        if (!reino) return
        if (loading.current) return
        try {
            loading.current = true
            modal.showLoadingModal('Creando personaje...')
            const character = await createCharacterRequest({ ...characterCreationValues, reino })
            updateUserData({ reino })
            addCharacter(character)
            modal.closeLoadingModal()
        } catch (error) {
            modal.closeLoadingModal()
            modal.showErrorModal(error)
        } finally {
            loading.current = false
        }
    }

    const createCharacter = async (nombre: string, genero: 'femenino' | 'masculino', raza: CharacterRace) => {
        if (loading.current) return
        try {
            loading.current = true
            const validResult = verifyName(nombre)
            if (!validResult) return
            modal.showLoadingModal('Creando personaje...')
            const character = await createCharacterRequest({
                genero,
                nombre,
                raza,
                reino: accountReino
            })
            addCharacter(character)
            modal.closeLoadingModal()

        } catch (error) {
            modal.closeLoadingModal()
            modal.showErrorModal(error)
        } finally {
            loading.current = false
        }
    }



    return {
        creationInstance,
        changeInstance,
        newAccount,
        handleCreateCharacter,
        createCharacterAfterReinoSeleciton
    }
}