import { useRef, type SubmitEventHandler } from "react"
import { useModal } from "../../../shared/modal/hooks/useModal"
import { useNavigate } from "react-router"
import { loginSchema } from "../schema/login.schema"
import { loginRequest } from "../api/auth.services"
import { useUserSession } from "../../userSession/hook/useUserSession"

export const useLoginForm = () => {
    const loading = useRef(false)
    const modal = useModal()
    const navigate = useNavigate()
    const userSession = useUserSession()

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        if (loading.current) return
        try {
            const body = Object.fromEntries(new FormData(event.target))
            const verifyResult = loginSchema.safeParse(body)
            if (!verifyResult.success) {
                const errors = verifyResult.error.issues.map(issue => issue.message)
                modal.showFeedBackModal({
                    title: 'Error al loguearse',
                    messages: errors,
                    onAccept: modal.closeModal
                })
                return
            }
            const data = verifyResult.data
            modal.showLoadingModal('Por favor, espera. Te éstas conectando al servidor.')
            const response = await loginRequest(data)            
            userSession.startUserSession(response)
            
            setTimeout(() => {
                modal.showLoadingModal('Has sido conectado al servidor.')
            }, 2000)
            setTimeout(() => {
                modal.showLoadingModal('Registro en curso...')
            }, 3500)
            setTimeout(() => {
                modal.closeLoadingModal()
                navigate('/character-selection')
            }, 4000)
        } catch (error) {
            modal.closeLoadingModal()
            modal.showErrorModal(error)
        }
    }

    return {
        handleSubmit
    }
}