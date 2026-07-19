import { useCallback, useEffect, useRef, useState } from "react";
import type { UseGameSocketResult } from "../types/use-game-socket.type";
import { createGameSocket } from "../socket";
import type { GameSocket } from "../types/socket.types";

export function useGameSocket(characterId?: string): UseGameSocketResult {
    const socketRef = useRef<GameSocket | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [worldSessionId, setWorldSessionId] = useState<string | null>(null);

    useEffect(() => {
        if (!characterId) return;

        const socket = createGameSocket(characterId);
        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            setIsReady(false);
            setWorldSessionId(null);
        });

        socket.on('connect_error', (error) => {
            console.error('Error conectando socket:', error.message);
        });

        socket.on('session:ready', (data) => {
            setIsReady(true);
            setWorldSessionId(data.worldSessionId);

            console.log('Sesión lista:', data);
        });

        socket.on('session:replaced', () => {
            console.warn('La sesión fue reemplazada por otra conexión.');
        });

        socket.on('session:expired', () => {
            console.warn('La sesión expiró.');
            socket.disconnect();
        });

        socket.connect();

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [characterId]);

    const emit = useCallback<UseGameSocketResult['emit']>((event, ...args) => {
        socketRef.current?.emit(event, ...args);
    }, []);



    const disconnect = useCallback(() => {
        socketRef.current?.disconnect();
    }, []);

    return {
        isConnected,
        isReady,
        emit,
        worldSessionId,
        disconnect,
    };
}