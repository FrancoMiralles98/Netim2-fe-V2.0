import { useEffect, useRef, useState } from "react"
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
    const [newAccount, setNewAccount] = useState(true)
    const loading = useRef(false)
    const modal = useModal()
    const { user, updateUserData } = useUserSession()

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

        await createCharacter(nombre, genero, raza)
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
                reino: characterCreationValues.reino
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