import type { ActionModalProps } from "./modals/actionModalProps";
import type { FeedBackModalProps } from "./modals/feedbackModalProps";
import type { NotificationModalProps } from "./modals/notificationModalProps";

export type ModalType = 
'none' | 
'loading' |
 'error' |
 'notification' |
 'feedback' |
 'action';

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
  sub_title?: string;
  messages?: string[]
  confirmText?: string;
  cancelText?: string;
}

export interface ModalContextValue {
  showLoadingModal: (message?: string) => void;
  closeLoadingModal: () => void;

  showFeedBackModal: (props: FeedBackModalProps) => void;
  showActionModal: (props:ActionModalProps) => void;
  showNotificationModal: (props:NotificationModalProps) => void;

  closeModal: () => void;
}