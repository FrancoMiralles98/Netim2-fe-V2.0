import type { UserSession } from "../../auth/types/user-session.types";
import type { AuthStatus } from "./auth-status.types";

export interface UserSessionContextValue {
    user: UserSession | null;
    isUserAuthenticated: boolean;
    loadingUserAuthenticate: boolean;
    startUserSession: (user: UserSession) => void
    refreshUserSession: () => Promise<void>;
    updateUserData: (data: Partial<UserSession>) => void
    clearUserSession: () => void;
    logout: () => void;
    authStatus: AuthStatus
}