import { CharacterPanel } from "../../features/game/components/CharacterPanel";
import { Navbar } from "../../features/game/components/Navbar";
import { RoutePanels } from "../../features/game/components/RoutePanels";
import { useGameGuard } from "../../features/game/hooks/useGame";

export const Game = () => {
    const {
        character,
        worldSessionId,
        gameReady,
    } = useGameGuard();
    if (!gameReady || !character || !worldSessionId) {
        return null;
    }

    const reino = character.reino;

    return (
        <section
            id='bg'
            className="min-h-[100dvh] min-w-[1300px] bg-auto bg-top"
            style={{
                backgroundImage: "linear-gradient(to right, #000 0%, transparent calc(50% - 650px), transparent calc(50% + 650px), #000 100%), url('/game/bg-game.png')",
                backgroundRepeat: 'no-repeat, repeat',
            }}
        >
            <div id='position' className="grid grid-cols-[17%_auto] min-h-[300px] w-[1300px] mx-auto">
                <Navbar character={character} />
                <RoutePanels reino={reino} />
                <CharacterPanel character={character} />
            </div>
        </section>
    )
}
