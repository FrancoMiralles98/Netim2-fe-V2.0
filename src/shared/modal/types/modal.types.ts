export type ModalType = 'none' | 'loading' | 'error' | 'success' | 'confirm';

export interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface MessageModalOptions {
  title?: string;
  message: string;
}

export interface ModalState {
  type: ModalType;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface ModalContextValue {
  showLoading: (message?: string) => void;
  hideLoading: () => void;

  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;

  confirm: (options: ConfirmModalOptions) => Promise<boolean>;

  closeModal: () => void;
}