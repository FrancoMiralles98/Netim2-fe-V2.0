import { createContext } from "react";
import type { CharacterSessionContextValue } from "../types/character-session-context-value.type";

export const CharacterSessionContext = createContext<CharacterSessionContextValue | null>(null)