import { useEffect, useState } from "react"
import type { CharacterSelectionType } from "../types/character-selection.type"
import { useModal } from "../../../shared/modal/hooks/useModal"
import { characterSelectionDataRequest } from "../api/characterSelection.services"
import type { CharacterSelectionDataType } from "netim2-shared"

export const useCharacterSelection = () => {
    const [type, setType] = useState<CharacterSelectionType>('selection')
    const modal = useModal()

    const [characterCreationConfig, setCharacterCreationCOnfig] =
        useState<CharacterSelectionDataType | null>(null)

    const changeType = (typeToChange: CharacterSelectionType) => {
        setType(typeToChange)
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
        characterCreationConfig,
    }
}