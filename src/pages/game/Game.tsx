import { useGameGuard } from "../../features/game/hooks/useGame";

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
        <section id='bg' className="bg-[url('/game/bg-game.png')] min-h-[100dvh]">
            <div id='position' className="bg-green-500/60 grid grid-cols-[17%_auto] h-[300px]  w-[1300px] mx-auto">
                <div id='navbar 1' className="">
                    <div id='general_options' className="bg-amber-300/60 h-[80px]" >
                        <section className="flex justify-center h-full items-center gap-3">
                           <img src="/game/icons_hud.png" className="w-[70%]" alt="" />
                        </section>
                    </div>
                </div>
                <div id='navbar 2' className="">
                </div>
            </div>
            <h1 className="text-red-600">Bienvenido {character.nombre}</h1>
            <h1 className="text-red-600">Bienvenido {worldSessionId ?? 'no asignado'}</h1>
            <button onClick={leaveGameToCharacterSelection} className="text-red-600 border border-red-500 p-2">character selection </button>
        </section>
    )
}