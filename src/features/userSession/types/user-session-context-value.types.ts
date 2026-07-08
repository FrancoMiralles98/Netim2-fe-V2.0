import type { UserSession } from "../../auth/types/user-session.types";

export interface UserSessionContextValue {
    user: UserSession | null;
    isUserAuthenticated: boolean;
    loadingUserAuthenticate: boolean;
    startUserSession: (user:UserSession) => void
    refreshUserSession: () => Promise<void>;
    clearUserSession: () => void;
    logout: () => void;
}