import type { GameSocket } from "./socket.types";

export interface UseGameSocketResult {
    socket: GameSocket | null;
    isConnected: boolean;
    isReady: boolean;
    worldSessionId: string | null;
}