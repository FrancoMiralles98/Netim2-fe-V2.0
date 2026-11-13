import { useState } from "react";
import { CharacterPanel } from "../../features/game/components/profile/CharacterPanel";
import { Navbar } from "../../features/game/components/hud/Navbar";
import { RoutePanels } from "../../features/game/components/navigation/RoutePanels";
import { CharacterSectionNav, type CharacterSection } from "../../features/game/components/navigation/CharacterSectionNav";
import { CharacterSkillsPanel } from "../../features/game/components/skills/CharacterSkillsPanel";
import { MissionJournal } from "../../features/game/components/missions/MissionJournal";
import { Explorar } from "../../features/explorar/Explorar";
import { useGameGuard } from "../../features/game/hooks/useGame";

export const Game = () => {
    const [activeSection, setActiveSection] = useState<CharacterSection | "explorar">("perfil");
    const {
        character,
        worldSessionId,
        gameReady,
    } = useGameGuard();
    if (!gameReady || !character || !worldSessionId) {
        return null;
    }

    const reino = character.reino;
    const isExploring = activeSection === "explorar";

    return (
        <section
            id='bg'
            className={`min-h-[100dvh] bg-auto bg-top ${isExploring ? "overflow-x-clip" : "min-w-[1300px]"}`}
            style={{
                backgroundImage: "linear-gradient(to right, #000 0%, transparent calc(50% - 650px), transparent calc(50% + 650px), #000 100%), url('/game/bg-game.png')",
                backgroundRepeat: 'no-repeat, repeat',
            }}
        >
            <div id='position' className={`mx-auto grid min-h-[300px] ${isExploring
                ? "w-full max-w-[1300px] grid-cols-[minmax(0,17%)_minmax(0,1fr)]"
                : "w-[1300px] grid-cols-[17%_auto]"}`}>
                <Navbar character={character} />
                <RoutePanels reino={reino} isExploreActive={isExploring} onExplore={() => setActiveSection("explorar")} />
                <div className={isExploring ? "min-w-0" : undefined}>
                    <CharacterSectionNav
                        reino={reino}
                        activeSection={isExploring ? null : activeSection}
                        onSelectSection={setActiveSection}
                    />

                    {activeSection === "perfil" && <CharacterPanel character={character} />}
                    {activeSection === "habilidades" && <CharacterSkillsPanel character={character} />}
                    {activeSection === "misiones" && (
                        <MissionJournal key={character.id} character={character} />
                    )}
                    {isExploring && <Explorar reino={reino} />}
                </div>
            </div>
        </section>
    )
}
