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
                <div >
                    {reino && (
                        <nav
                            aria-label="Secciones del personaje"
                            className="relative aspect-[1300/128] mt-[2rem] ml-[3px] w-full"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-[length:100%_100%] bg-no-repeat brightness-83"
                                style={{ backgroundImage: `url('/game/navbar-2-${reino}.png')` }}
                            />
                            <div className="absolute inset-y-[18%] right-[7%] left-[7%] z-10 grid grid-cols-4 items-center text-center font-metin text-[15px] font-semibold text-[#f5e1b5] [text-shadow:0_2px_3px_#000]">
                                <span>Perfil</span>
                                <span>Habilidades</span>
                                <span>Misiones</span>
                                <span>Historial</span>
                            </div>
                        </nav>
                    )}

                    <CharacterPanel character={character} />
                </div>
            </div>
        </section>
    )
}
