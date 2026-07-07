import { Outlet } from "react-router"
import { ModalProvider } from "../../shared/modal/ModalProvider"

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-black">
            <ModalProvider>
                <Outlet />
            </ModalProvider>
        </div>
    )
}