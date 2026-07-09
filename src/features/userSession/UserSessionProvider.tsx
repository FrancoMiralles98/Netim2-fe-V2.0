import { useRef, useState, type ReactNode } from "react";
import type { UserSession } from "../auth/types/user-session.types";
import { UserSessionContext } from "./context/user-session.context";
import { refreshUserSessionRequest } from "./api/user-session.services";
import { useModal } from "../../shared/modal/hooks/useModal";
import { logoutRequest } from "../auth/api/auth.services";
import { useNavigate } from "react-router";
import { RouterPaths } from "../../app/router/router-paths.types";


export const UserSessionProvider = ({ children }: { children: ReactNode }) => {
    const [user, SetUser] = useState<UserSession | null>(null)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
    const [loadingUserAuthenticate, setLoadingUserAuthenticate] = useState(false)
    const loading = useRef(false)
    const modal = useModal()
    const navigate = useNavigate()

    const clearUserSession = () => {
        SetUser(null)
        setIsUserAuthenticated(false)
    }

    const logout = async () => {
        if (loading.current) return
        loading.current = true
        try {
            modal.showLoadingModal('Saliendo...')
            await logoutRequest()
            modal.closeLoadingModal()
            navigate(RouterPaths.LANDING_PAG)
        } catch (error) {
            modal.showErrorModal(error, true)
        } finally {
            clearUserSession()
        }
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
            refreshUserSession,
            logout
        }}>
            {children}
        </UserSessionContext.Provider>
    )
}