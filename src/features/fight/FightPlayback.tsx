import { useEffect, useMemo, useRef, useState } from "react";
import type { FightResponse } from "netim2-shared";
import { InitiativeModal } from "./initiative/InitiativeModal";
import { FightFighterCard } from "./card/FighterCard";
import { useFightPlayBack } from "./animations/hook/useFightPlayBack";
import { FightResultModal } from "./animations/components/FightResultModal";
import { mapInitialFightersToState } from "./utils/mapper-initial-fighters";
import { FightPlaybackControls } from "./card/components/FightPlayBackControls";
import type { FighterFightSummary } from "../fightResult/types/fighter-fight-summary.types";
import { getSkillEffect } from "./animations/skill-effects";
import type { SkillEffectMode } from "./animations/skill-effects";
import { SkillEffectLayer } from "./animations/components/SkillEffectLayer";
import { getAuraEffect } from "./animations/aura-effects";

interface FightPlaybackProps {
    response: FightResponse;
    onFinishFight: (summary: FighterFightSummary[]) => void;
    skillEffectModes?: Partial<Record<number, SkillEffectMode>>;
}

export const FightPlayback = ({ response, onFinishFight, skillEffectModes }: FightPlaybackProps) => {
    const battlefieldRef = useRef<HTMLElement>(null);
    const [openInitiative, setOpenInitiative] = useState(true);
    const initialFighters = useMemo(() => mapInitialFightersToState(response.initialFighters), [response]);
    const initiativeResults = response.initiativeResults;
    const {
        fightersState, playback, play, pause, reset, closeFightResult, fightResult,
        isPlaying, isPaused, speed, changeSpeed,
    } = useFightPlayBack({ initialFighters, events: response.fightPlaybackPayload, result: response.result });

    useEffect(() => {
        const sources = new Set(initialFighters.flatMap(fighter =>
            fighter.skills.flatMap(skill => {
                const sheet = getSkillEffect(skill.skillId) ?? getAuraEffect(skill.skillId);
                return sheet ? [sheet.src] : [];
            })
        ));
        sources.forEach(src => {
            const image = new Image();
            image.src = src;
        });
    }, [initialFighters]);

    const comenzarPelea = () => {
        setOpenInitiative(false);
        play();
    };

    const finishFight = () => {
        const skillsByFighterId = new Map(response.initialFighters.map(fighter => [fighter.fighterId, fighter.skills]));
        closeFightResult();
        onFinishFight(response.fighterFightSummary.map(fighter => ({
            ...fighter,
            skills: skillsByFighterId.get(fighter.fighterId) ?? [],
        })));
    };

    const allies =
        fightersState.filter(
            fighter =>
                fighter.side === 'allies'
        );

    const enemies =
        fightersState.filter(
            fighter =>
                fighter.side === 'enemies'
        );

    return (
        <section
            className="
                mx-auto
                w-[80%]
                pt-[5rem]
            "
        >
            <FightResultModal
                result={fightResult}
                fighters={fightersState}
                onFinishFight={finishFight}
            />

            <FightPlaybackControls
                loadingFight={false}
                fightReady={!openInitiative}

                isPlaying={isPlaying}
                isPaused={isPaused}

                speed={speed}

                onPlay={play}
                onPause={pause}
                onReset={reset}

                onChangeSpeed={changeSpeed}
            />

            {/* INITIATIVE */}
            <InitiativeModal
                open={
                    openInitiative
                }
                fighters={initialFighters}
                initiativeResults={
                    initiativeResults
                }
                onBattleStart={
                    comenzarPelea
                }
            />

            {/* TURNO ACTUAL */}
            <div
                className="
                    mt-5
                    text-center
                    text-white
                "
            >
                Turno {playback.currentTurn}
            </div>

            {/* CAMPO DE BATALLA */}
            <section
                ref={battlefieldRef}
                className="
                    relative
                    mt-10
                    grid
                    grid-cols-2
                    gap-16
                "
            >
                {playback.skillEffect && (
                    <SkillEffectLayer
                        key={playback.skillEffect.id}
                        effect={playback.skillEffect}
                        battlefieldRef={battlefieldRef}
                        paused={isPaused}
                        speed={speed}
                        mode={skillEffectModes?.[playback.skillEffect.skillId]}
                    />
                )}
                {/* ALLIES */}
                <div>
                    <h2
                        className="
                            mb-4
                            text-left
                            text-sm
                            font-semibold
                            uppercase
                            tracking-wider
                            text-blue-400
                        "
                    >
                        Allies
                    </h2>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-start
                            justify-start
                            gap-x-4
                            gap-y-8
                        "
                    >
                        {allies.map(
                            fighter => (
                                <FightFighterCard
                                    key={
                                        fighter.fighterId
                                    }
                                    speed={speed}
                                    paused={isPaused}
                                    fighter={
                                        fighter
                                    }
                                    fighters={
                                        fightersState
                                    }
                                    isCurrentActor={
                                        playback.currentActorId ===
                                        fighter.fighterId
                                    }
                                    isCurrentTarget={
                                        playback.currentTargetId ===
                                        fighter.fighterId
                                    }
                                    selectedAction={
                                        playback.currentActorId ===
                                            fighter.fighterId
                                            ? playback.currentAction
                                            : undefined
                                    }
                                    animation={
                                        playback.animation
                                    }
                                    message={
                                        playback.currentActorId ===
                                            fighter.fighterId
                                            ? playback.message
                                            : undefined
                                    }
                                />
                            )
                        )}
                    </div>
                </div>

                {/* ENEMIES */}
                <div>
                    <h2
                        className="
                            mb-4
                            text-right
                            text-sm
                            font-semibold
                            uppercase
                            tracking-wider
                            text-red-400
                        "
                    >
                        Enemies
                    </h2>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-start
                            justify-end
                            gap-x-4
                            gap-y-8
                        "
                    >
                        {enemies.map(
                            fighter => (
                                <FightFighterCard
                                    key={
                                        fighter.fighterId
                                    }
                                    fighter={
                                        fighter
                                    }
                                    speed={speed}
                                    paused={isPaused}
                                    fighters={
                                        fightersState
                                    }
                                    isCurrentActor={
                                        playback.currentActorId ===
                                        fighter.fighterId
                                    }
                                    isCurrentTarget={
                                        playback.currentTargetId ===
                                        fighter.fighterId
                                    }
                                    selectedAction={
                                        playback.currentActorId ===
                                            fighter.fighterId
                                            ? playback.currentAction
                                            : undefined
                                    }
                                    animation={
                                        playback.animation
                                    }
                                    message={
                                        playback.currentActorId ===
                                            fighter.fighterId
                                            ? playback.message
                                            : undefined
                                    }
                                />
                            )
                        )}
                    </div>
                </div>
            </section>
        </section>
    );
};
