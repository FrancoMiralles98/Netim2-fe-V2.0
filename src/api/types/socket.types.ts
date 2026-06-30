import type { Socket } from "socket.io-client";

export interface ServerToClientEvents {
    'session:ready': (data: {
        worldSessionId: string;
        characterId: string
    }) => void;

    'session:replaced': () => void;

    'session:expired': () => void;
}

export type GameSocket = Socket<ServerToClientEvents>