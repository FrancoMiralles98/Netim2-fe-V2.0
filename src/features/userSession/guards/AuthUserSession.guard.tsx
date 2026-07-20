import { useEffect, type ReactNode } from "react";
import { useUserSession } from "../hook/useUserSession";
import { Navigate } from "react-router";
import { RouterPaths } from "../../../app/router/router-paths.types";

export const AuthUserSessionGuard = ({ children }: { children: ReactNode }) => {
    const {
        authStatus,
        isUserAuthenticated,
        refreshUserSession,
        
    } = useUserSession();

    useEffect(() => {
        if (authStatus !== 'idle') return;

        void refreshUserSession();
    }, [authStatus, refreshUserSession]);

    if (authStatus === 'idle' || authStatus === 'checking') {
        return <div className="text-white">Cargando sesión...</div>;
    }

    if (!isUserAuthenticated) {
        return <Navigate to={RouterPaths.LANDING_PAG} replace />;
    }

    return <>{children}</>;
};