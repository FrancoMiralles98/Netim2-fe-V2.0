import { useGameGuard } from "../../features/game/hooks/useGame";
import { NetimButton } from "../../shared/button/ButtomNetim";
import { NetimText } from "../../shared/typography/components/NetimText";

export const Game = () => {
    const {
        character,
        worldSessionId,
        gameReady,
        leaveGameToCharacterSelection,
    } = useGameGuard();

    if (!gameReady || !character || !worldSessionId) {
        return null;
    }

    return (
        <section >
            <div className="w-[240px] relative h-[320px] bg-[length:100%_100%] ">
            </div>
            <h1 className="text-red-600">Bienvenido {character.nombre}</h1>
            <h1 className="text-red-600">Bienvenido {worldSessionId ?? 'no asignado'}</h1>
            <button onClick={leaveGameToCharacterSelection} className="text-red-600 border border-red-500 p-2">character selection </button>
        </section>
    )
}