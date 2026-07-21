import { useRef } from "react"
import { useModal } from "../../../shared/modal/hooks/useModal"
import type { CharacterSummary } from "netim2-shared"
import { deleteCharacterRequest } from "../api/characterSelection.services"
import { useNavigate } from "react-router"
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession"
import { RouterPaths } from "../../../app/router/router-paths.types"

export const useSelection = (deleteCharacter: (nombre: string) => void) => {
    const loading = useRef(false)
    const modal = useModal()
    const navigate = useNavigate()
    const { enterGame } = useCharacterSession()

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

    const handleConnectCharacter = (character: CharacterSummary) => {
        enterGame(character)
        navigate(RouterPaths.GAME)
    }

    return { handleDeleteCharacter, handleConnectCharacter }
}