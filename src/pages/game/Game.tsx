import { Navigate } from "react-router"
import { useCharacterSession } from "../../features/characterSession/hooks/useCharacterSession"
import { RouterPaths } from "../../app/router/router-paths.types"

export const Game = () => {

    const { character, isConnected, isReady,worldSessionId,leaveGameToCharacterSelection } = useCharacterSession()

    if (!character) {
        return <Navigate to={RouterPaths.CHARACTER_SELECTION} replace />
    }

    if (!isConnected || !isReady) {
        <div className="text-red-600">
            Conectando con el mundo...
        </div>
    }

    return (
        <>
            <h1 className="text-red-600">Bienvenido {character.nombre}</h1>
            <h1 className="text-red-600">Bienvenido {worldSessionId ?? 'no asignado'}</h1>
            <button onClick={leaveGameToCharacterSelection} className="text-red-600 border border-red-500 p-2">character selection </button>
        </>
    )
}