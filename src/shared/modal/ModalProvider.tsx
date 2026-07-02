import { useRef, useState, type ReactNode } from "react";
import { ModalContext } from "./context/modal.context";
import type { ModalState } from "./types/modal.types";
import type { ActionModalProps } from "./types/modals/actionModalProps";
import { ActionModal } from "./components/ActionModal";
import type { NotificationModalProps } from "./types/modals/notificationModalProps";
import { NotificationModal } from "./components/NotificationModal";
import { LoadingModal } from "./components/LoadingModal";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'none', });

    const actionRef = useRef<(() => void | Promise<void>) | null>(null)

    const closeModal = () => {
        setModalState({ type: 'none' });
        actionRef.current = null;
    };

    const showActionModal = (props: ActionModalProps) => {
        actionRef.current = props.onAccept
        setModalState({
            type: 'action',
            cancelText: props.cancelText ?? 'Cancelar',
            confirmText: props.acceptText ?? 'Aceptar',
            title: props.title,
            sub_title: props.subTitle,
        })
    }

    const showNotificationModal = (props: NotificationModalProps) => {
        actionRef.current = props.onClickButton ?? null
        setModalState({
            type: 'notification',
            title: props.title,
            confirmText: props.acceptMessage ?? 'Ok'
        })
    }

    const handleAcceptAction = async () => {
        try {
            await actionRef.current?.()
            closeModal()
        } catch (error) {
            closeModal();
            showNotificationModal({
                title: 'Hubo un error',
                onClickButton: closeModal,
            })
        }
    }

    const showLoadingModal = (message?: string) => {
        setModalState({ type: 'loading', title: message ?? 'Cargando...' })
    }

    const closeLoadingModal = () => {
        setModalState({ type: 'none' })
        actionRef.current = null
    }


    return (
        <ModalContext value={{
            closeModal,
            showNotificationModal,
            showActionModal,
            showLoadingModal,
            closeLoadingModal
        }}>
            {children}

            {modalState.type === 'action' && (
                <ActionModal
                    title={modalState.title!}
                    subTitle={modalState.sub_title!}
                    onAccept={handleAcceptAction}
                    onCancel={closeModal}
                    acceptText={modalState.confirmText!}
                    cancelText={modalState.cancelText!}
                />
            )}

            {modalState.type === 'notification' && (
                <NotificationModal
                    onClickButton={handleAcceptAction}
                    title={modalState.title!}
                    acceptMessage={modalState.confirmText}
                />
            )}

            {modalState.type === 'loading' && (
                <LoadingModal
                    message={modalState.title!}
                />
            )}
        </ModalContext>
    )
}