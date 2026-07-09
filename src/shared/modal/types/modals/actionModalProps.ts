export interface ActionModalProps {
    title: string;
    subTitle: string;
    acceptText?: string;
    cancelText?: string;
    onAccept: () => void
    onCancel?: () => void
}