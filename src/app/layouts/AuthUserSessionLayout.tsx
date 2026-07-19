import { Outlet } from "react-router"
import { AuthUserSessionGuard } from "../../features/userSession/guards/AuthUserSession.guard"
import { CharacterSessionProvider } from "../../features/characterSession/CharacterSessionProvider"

export const AuthUserSessionLayout = () => {
    return (
        <>
            <AuthUserSessionGuard>
                <CharacterSessionProvider>
                    <Outlet />
                </CharacterSessionProvider>
            </AuthUserSessionGuard>
        </>
    )
}