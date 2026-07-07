import { createContext } from "react";
import type { UserSessionContextValue } from "../types/user-session-context-value.types";

export const UserSessionContext = createContext<UserSessionContextValue | null>(null)