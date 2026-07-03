export interface ErrorModalProps {
    message: string;
    errors: string[];
    status: number;
    onAccept: () => void
}