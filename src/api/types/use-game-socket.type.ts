import type { ClientToServerEvents } from "./socket.types";

export interface UseGameSocketResult {
    isConnected: boolean;
    isReady: boolean;
    worldSessionId: string | null;
    disconnect: () => void;
    emit: <TEvent extends keyof ClientToServerEvents>(
        event: TEvent,
        ...args: Parameters<ClientToServerEvents[TEvent]>
    ) => void;
}