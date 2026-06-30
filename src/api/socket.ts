import { io } from "socket.io-client"

export const createGameSocket = (characterId: string) => {
    return io(import.meta.env.VITE_BACKEND_URL,{
        withCredentials: true,
        autoConnect: false,
        auth: {
            characterId
        }
    })
}