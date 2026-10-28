import { useState } from "react";
import { CharacterPanel } from "../../features/game/components/profile/CharacterPanel";
import { Navbar } from "../../features/game/components/hud/Navbar";
import { RoutePanels } from "../../features/game/components/navigation/RoutePanels";
import { CharacterSectionNav, type CharacterSection } from "../../features/game/components/navigation/CharacterSectionNav";
import { CharacterSkillsPanel } from "../../features/game/components/skills/CharacterSkillsPanel";
import { useGameGuard } from "../../features/game/hooks/useGame";

export const Game = () => {
    const [activeSection, setActiveSection] = useState<CharacterSection>("perfil");
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
                    <CharacterSectionNav reino={reino} activeSection={activeSection} onSelectSection={setActiveSection} />

                    {activeSection === "perfil" ? (
                        <CharacterPanel character={character} />
                    ) : (
                        <CharacterSkillsPanel reino={reino} raza={character.raza} />
                    )}
                </div>
            </div>
        </section>
    )
}
