import { useRef } from "react"
import { useModal } from "../../../shared/modal/hooks/useModal"
import type { CharacterSummary } from "netim2-shared"
import { deleteCharacterRequest } from "../api/characterSelection.services"

export const useSelection = (deleteCharacter: (nombre: string) => void) => {
    const loading = useRef(false)
    const modal = useModal()

    const handleDeleteCharacter = async (character: CharacterSummary) => {
        if (loading.current) return
        try {
            loading.current = true
            modal.showLoadingModal('Eliminando personaje..')
            await deleteCharacterRequest(character.id)
            deleteCharacter(character.nombre)
            modal.closeLoadingModal()
            modal.showNotificationModal({
                title: 'El personaje se ha eliminado exitosamente.'
            })
        } catch (error) {
            modal.closeLoadingModal()
            modal.showErrorModal(error)
        } finally {
            loading.current = false
        }
    }

    return { handleDeleteCharacter }
}