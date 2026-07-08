import { Outlet } from "react-router"
import { AuthUserSessionGuard } from "../../features/userSession/guards/AuthUserSession.guard"

export const AuthUserSessionLayout = () => {
    return (
        <>
            <AuthUserSessionGuard>
                <Outlet />
            </AuthUserSessionGuard>
        </>
    )
}