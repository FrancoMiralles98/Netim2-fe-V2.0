import { useState, type ReactNode } from "react";
import { ModalContext } from "./context/modal.context";
import type { ModalState } from "./types/modal.types";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalState, setModalState] = useState<ModalState>({type: 'none',});
     
    

    return (
        <ModalContext value={{

        }}>
            {children}
        </ModalContext>
    )
}