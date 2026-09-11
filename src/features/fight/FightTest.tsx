import { useState } from "react"
import { InitiativeModal } from "./initiative/InitiativeModal"
import { FightFighterCard } from "./card/FighterCard"
import type { FightFighterState } from "./card/fighter-state"
import { useFightPlayBack } from "./animations/hook/useFightPlayBack"
import { FightResultModal } from "./animations/components/FightResultModal"
import type { FighterInitiativeResult, FightPlaybackPayload } from "netim2-shared"
import { fightLabRequest } from "./api/fight.services"
import { mapInitialFightersToState } from "./utils/mapper-initial-fighters"
import { FightPlaybackControls } from "./card/components/FightPlayBackControls"
import { useModal } from "../../shared/modal/hooks/useModal"

export const FightTest = () => {
    const [openInitiative, setOpenInitiative] =
        useState(false);

    const modal = useModal();

    const [fightEvents, setFightEvents] =
        useState<FightPlaybackPayload | undefined>(
            undefined
        );

    const [loadingFight, setLoadingFight] =
        useState(false);

    const [initialFighters, setInitialFighters] =
        useState<FightFighterState[]>([]);

    const [initiativeResults, setInitiativeResults] =
        useState<FighterInitiativeResult[]>([]);

    const {
        fightersState,
        playback,

        play,
        pause,
        reset,

        closeFightResult,
        fightResult,

        isPlaying,
        isPaused,

        speed,
        changeSpeed
    } = useFightPlayBack({
        initialFighters,
        events: fightEvents
    });

    const fightReady =
        !loadingFight &&
        fightEvents !== undefined &&
        initialFighters.length > 0;

    const loadFight = async (): Promise<void> => {
        if (loadingFight) {
            return;
        }

        closeFightResult();

        setOpenInitiative(false);

        setFightEvents(undefined);
        setInitialFighters([]);
        setInitiativeResults([]);

        setLoadingFight(true);

        try {
            const response = await fightLabRequest();

            const fighters = mapInitialFightersToState(response.initialFighters);

            setInitialFighters(fighters);

            setFightEvents(response.fightPlaybackPayload);

            setInitiativeResults(response.initiativeResults);

            setOpenInitiative(true);

        } catch (error) {
            modal.showErrorModal(error)
        } finally {
            setLoadingFight(false);
        }
    };

    const comenzarPelea = (): void => {
        if (
            !fightEvents ||
            initialFighters.length === 0
        ) {
            return;
        }

        setOpenInitiative(false);

        play();
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
                onClose={closeFightResult}
            />

            <FightPlaybackControls
                loadingFight={loadingFight}
                fightReady={fightReady}

                isPlaying={isPlaying}
                isPaused={isPaused}

                speed={speed}

                onLoadFight={loadFight}
                onPlay={play}
                onPause={pause}
                onReset={reset}

                onChangeSpeed={changeSpeed}
            />

            {/* LOADING */}
            {loadingFight && (
                <div
                    className="
                        mt-6
                        flex
                        items-center
                        justify-center
                        gap-3

                        text-sm
                        text-slate-300
                    "
                >
                    <div
                        className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-slate-600
                            border-t-white
                        "
                    />

                    Procesando pelea...
                </div>
            )}

            {/* INITIATIVE */}
            <InitiativeModal
                open={
                    openInitiative &&
                    fightReady
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
                className="
                    mt-10
                    grid
                    grid-cols-2
                    gap-16
                "
            >
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