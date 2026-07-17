import { useEffect, useState } from "react"
import type { CharacterSelectionType } from "../types/character-selection.type"
import { useModal } from "../../../shared/modal/hooks/useModal"
import { characterSelectionDataRequest } from "../api/characterSelection.services"
import type { CharacterSelectionDataType, CharacterSummary } from "netim2-shared"

export const useCharacterSelection = () => {
    const [type, setType] = useState<CharacterSelectionType>('selection')
    const modal = useModal()

    const [characterCreationConfig, setCharacterCreationCOnfig] =
        useState<CharacterSelectionDataType | null>(null)

    const changeType = (typeToChange: CharacterSelectionType) => {
        if (!characterCreationConfig) return
        if (typeToChange === 'creation') {
            if (characterCreationConfig.characters.length >= characterCreationConfig.maxCharacters) {
                modal.showNotificationModal({
                    title: 'Has llegado al máximo de personajes creados.'
                })
                return
            }
        }
        setType(typeToChange)
    }

    const addCharacter = (character: CharacterSummary) => {
        setCharacterCreationCOnfig((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                characters: [character, ...prev.characters]
            }
        })
    }

    const deleteCharacter = async (nombre: string) => {
        if (!characterCreationConfig) return
        const newList = characterCreationConfig.characters.filter(character => character.nombre !== nombre)
        setCharacterCreationCOnfig((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                characters: newList
            }
        })
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                modal.showLoadingModal('Cargando...')
                const request = await characterSelectionDataRequest()
                setCharacterCreationCOnfig(request)
                modal.closeLoadingModal()
            } catch (error) {
                modal.showErrorModal(error)
            }
        }
        loadData()
    }, [])


    return {
        type,
        changeType,
        addCharacter,
        deleteCharacter,
        characterCreationConfig,
    }
}