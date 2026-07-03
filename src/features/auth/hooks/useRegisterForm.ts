import { useRef, type SubmitEventHandler } from "react"
import { useModal } from "../../../shared/modal/hooks/useModal"
import { registerSchema, type RegisterFormData } from "../schema/register.schema"
import { registerRequest } from "../api/auth.services"
import { ApiError } from "../../../api/api-error"

export const useRegisterForm = () => {
    const loading = useRef(false)
    const modal = useModal()

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        if (loading.current) return
        loading.current = true
        try {
            const body = Object.fromEntries(new FormData(event.currentTarget))
            const verifyResult = registerSchema.safeParse(body)
            if (!verifyResult.success) {
                const errors = verifyResult.error.issues.map(issue => issue.message)
                modal.showFeedBackModal({
                    title: 'Error al registrarse',
                    messages: errors,
                    onAccept: modal.closeModal
                })
                return
            }
            const registerBody = verifyResult.data
            await registerRequest(registerBody)
        } catch (error) {
            if (error instanceof ApiError) {
                
            }
        }
        finally {
            loading.current = false
        }
    }

    return {
        handleSubmit
    }


}