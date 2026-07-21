import { useRef, useState, type ReactNode } from "react";
import type { UserSession } from "../auth/types/user-session.types";
import { UserSessionContext } from "./context/user-session.context";
import { refreshUserSessionRequest } from "./api/user-session.services";
import { useModal } from "../../shared/modal/hooks/useModal";
import { logoutRequest } from "../auth/api/auth.services";
import { useNavigate } from "react-router";
import { RouterPaths } from "../../app/router/router-paths.types";
import type { AuthStatus } from "./types/auth-status.types";

export const UserSessionProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSession | null>(null)
    const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
    const isUserAuthenticated = authStatus === 'authenticated';
    const loadingUserAuthenticate = authStatus === 'checking';
    
    const loading = useRef(false)
    const modal = useModal()
    const navigate = useNavigate()

    const updateUserData = (data: Partial<UserSession>) => {
        setUser((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                ...data
            }
        })
    }

    const clearUserSession = () => {
        setUser(null)
        setAuthStatus('unauthenticated');
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
            loading.current = false
            clearUserSession()
        }
    }

    const startUserSession = (user: UserSession) => {
        setUser(user)
        setAuthStatus('authenticated');
    }

    const refreshUserSession = async () => {
        if (loading.current) return
        loading.current = true
        setAuthStatus('checking');
        try {
            const response = await refreshUserSessionRequest()
            setUser(response)
            setAuthStatus('authenticated');
        } catch (error) {
            clearUserSession()
            setAuthStatus('unauthenticated');
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
            authStatus,
            clearUserSession,
            startUserSession,
            refreshUserSession,
            updateUserData,
            logout
        }}>
            {children}
        </UserSessionContext.Provider>
    )
}