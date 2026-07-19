import type { Socket } from "socket.io-client";

export interface ServerToClientEvents {
    'session:ready': (data: {
        worldSessionId: string;
        characterId: string
    }) => void;

    'session:replaced': () => void;

    'session:expired': () => void;
}

export interface ClientToServerEvents {
    'player:ping': () => void;
}

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>