import { useRef, useState, type ReactNode } from "react";
import type { UserSession } from "../auth/types/user-session.types";
import { UserSessionContext } from "./context/user-session.context";
import { refreshUserSessionRequest } from "./api/user-session.services";
import { useModal } from "../../shared/modal/hooks/useModal";


export const UserSessionProvider = ({ children }: { children: ReactNode }) => {
    const [user, SetUser] = useState<UserSession | null>(null)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
    const [loadingUserAuthenticate, setLoadingUserAuthenticate] = useState(false)
    const loading = useRef(false)
    const modal = useModal()

    const clearUserSession = () => {
        SetUser(null)
        setIsUserAuthenticated(false)
    }

    const startUserSession = (user: UserSession) => {
        SetUser(user)
        setIsUserAuthenticated(true)
    }

    const refreshUserSession = async () => {
        if (loading.current) return
        loading.current = true
        try {
            setIsUserAuthenticated(true)
            const response = await refreshUserSessionRequest()
            SetUser(response)
            setIsUserAuthenticated(true)
            setLoadingUserAuthenticate(false)
        } catch (error) {
            clearUserSession()
            setLoadingUserAuthenticate(false)
            modal.showErrorModal(error, true)
        } finally {
            loading.current = false
        }
    }

    return (
        <UserSessionContext.Provider value={{
            user,
            isUserAuthenticated,
            loadingUserAuthenticate,
            clearUserSession,
            startUserSession,
            refreshUserSession
        }}>
            {children}
        </UserSessionContext.Provider>
    )
}