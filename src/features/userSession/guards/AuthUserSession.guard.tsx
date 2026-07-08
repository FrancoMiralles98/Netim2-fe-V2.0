import { type ReactNode } from "react";
import { useUserSession } from "../hook/useUserSession";
import { Navigate } from "react-router";

export const AuthUserSessionGuard = ({ children }: { children: ReactNode }) => {
    const userSession = useUserSession()
    if (userSession.loadingUserAuthenticate) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Cargando sesión...
            </div>
        )
    }

    if (!userSession.isUserAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}