import { useState } from "react";
import { CharacterPanel } from "../../features/game/components/profile/CharacterPanel";
import { Navbar } from "../../features/game/components/hud/Navbar";
import { RoutePanels } from "../../features/game/components/navigation/RoutePanels";
import { CharacterSectionNav, type CharacterSection } from "../../features/game/components/navigation/CharacterSectionNav";
import { CharacterSkillsPanel } from "../../features/game/components/skills/CharacterSkillsPanel";
import { MissionJournal } from "../../features/game/components/missions/MissionJournal";
import { Historial } from "../../features/game/components/historial/Historial";
import { Explorar } from "../../features/explorar/Explorar";
import { useGameGuard } from "../../features/game/hooks/useGame";
import { useStartFight } from "../../features/fight/hooks/useStartFight";
import { FightView } from "../../features/fight/FightView";

export const Game = () => {
    const [activeSection, setActiveSection] = useState<CharacterSection | "explorar">("perfil");
    const {
        character,
        worldSessionId,
        gameReady,
    } = useGameGuard();
    const { response: fight, startFight, isPending: isStartingFight, clearFight } = useStartFight(character?.id);
    if (!gameReady || !character || !worldSessionId) {
        return null;
    }

    const reino = character.reino;
    const isExploring = activeSection === "explorar";

    return (
        <>
        <div hidden={Boolean(fight)}>
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

                    {!fight && activeSection === "perfil" && <CharacterPanel character={character} />}
                    {!fight && activeSection === "habilidades" && <CharacterSkillsPanel character={character} />}
                    {!fight && activeSection === "misiones" && (
                        <MissionJournal key={character.id} character={character} />
                    )}
                    {!fight && activeSection === "historial" && <Historial />}
                    {(isExploring || fight) && (
                        <div hidden={Boolean(fight)}>
                            <Explorar
                                key={character.id}
                                reino={reino}
                                isStartingFight={isStartingFight}
                                onFight={(mob, quantity) => startFight({ idMob: mob.idMob, quantity })}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
        </div>
        {fight && (
            <div className="min-h-dvh w-full bg-[#0c0d10] pb-10">
                <FightView
                    key={fight.fightPlaybackPayload.fightId}
                    response={fight}
                    onBack={() => {
                        setActiveSection("explorar");
                        clearFight();
                    }}
                />
            </div>
        )}
        </>
    )
}
