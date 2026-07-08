import { Outlet } from "react-router"
import { ModalProvider } from "../../shared/modal/ModalProvider"
import { UserSessionProvider } from "../../features/userSession/UserSessionProvider"

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-black">
            <ModalProvider>
                <UserSessionProvider>
                <Outlet />
                </UserSessionProvider>
            </ModalProvider>
        </div>
    )
}