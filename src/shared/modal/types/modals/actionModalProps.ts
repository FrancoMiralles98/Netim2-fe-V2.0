export interface ActionModalProps {
    messagePrincipal: string;
    messageSecondary: string;
    acceptText: string;
    cancelText: string;
    onAccept: () => void
    onClose: () => void
}