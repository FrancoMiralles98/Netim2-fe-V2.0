import type { UserSession } from "../../auth/types/user-session.types";

export interface UserSessionContextValue {
    user: UserSession | null;
    isUserAuthenticated: boolean;
    loadingUserAuthenticate: boolean;
    startUserSession: (user:UserSession) => void
    refreshUserSession: () => Promise<void>;
    updateUserData: (data:Partial<UserSession>) => void
    clearUserSession: () => void;
    logout: () => void;
}