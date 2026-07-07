import { useContext } from "react"
import { UserSessionContext } from "../context/user-session.context"

export const useUserSession = () => {
    const context = useContext(UserSessionContext)

    if (!context) {
        throw new Error ('userSession debe usarse dentro de SessionProvider')
    }

    return context
}