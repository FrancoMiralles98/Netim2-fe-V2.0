import { useState } from "react"
import { InitiativeModal } from "./initiative/InitiativeModal"
import { NetimButton } from "../../shared/button/ButtomNetim"
import { fighters, initiativeResults } from "./valuesToUse/initiative/initiativeValues"
import { FightFighterCard } from "./card/FighterCard"
import { GuereroState, MobState } from "./valuesToUse/card/FighterState"
import type { FightFighterState } from "./card/fighter-state"
import { useFightPlayBack } from "./animations/hook/useFightPlayBack"
import { EXPLICIT_EVENTS } from "./animations/Test/explicits-events"

export const FightTest = () => {
    const [openInitiative, setOpenInitiative] = useState(false);

    const initialFighters: FightFighterState[] = [GuereroState, MobState,];

    const {
        fightersState,
        playback,
        play,
        pause,
        reset,
        isPlaying,
        isPaused,
        speed,
        changeSpeed
    } = useFightPlayBack({ initialFighters, events: EXPLICIT_EVENTS });

    const changeValue = () => {
        setOpenInitiative(prev => !prev);
    };

    const comenzarPelea = () => {
        setOpenInitiative(false);
        /*
         * Empieza a reproducir FightEvent[]
         */
        play();
    };


    const allies = fightersState.filter(
        fighter => fighter.side === 'allies'
    );

    const enemies = fightersState.filter(
        fighter => fighter.side === 'enemies'
    );

    return (
        <section className="mx-auto w-[80%] pt-[5rem]">

            {/* Controles temporales */}
            <div className="flex items-center gap-2">

                <NetimButton
                    text="Abrir"
                    onClickButtom={changeValue}
                />

                <button
                    type="button"
                    onClick={play}
                    disabled={isPlaying && !isPaused}
                    className="
                        rounded
                        bg-green-700
                        px-3
                        py-1
                        text-white
                        disabled:opacity-40
                    "
                >
                    {isPaused ? 'Continuar' : 'Play'}
                </button>

                <button
                    type="button"
                    onClick={pause}
                    disabled={!isPlaying || isPaused}
                    className="
                        rounded
                        bg-yellow-700
                        px-3
                        py-1
                        text-white
                        disabled:opacity-40
                    "
                >
                    Pause
                </button>

                <button
                    type="button"
                    onClick={() => changeSpeed(1)}
                    className={`
                        rounded
                        px-2
                        py-1
                        text-white
                        ${speed === 1
                            ? 'bg-blue-600'
                            : 'bg-slate-700'
                        }
                    `}
                >
                    x1
                </button>

                <button
                    type="button"
                    onClick={() => changeSpeed(2)}
                    className={`
                        rounded
                        px-2
                        py-1
                        text-white
                        ${speed === 2
                            ? 'bg-blue-600'
                            : 'bg-slate-700'
                        }
                    `}
                >
                    x2
                </button>

                <button
                    type="button"
                    onClick={() => changeSpeed(4)}
                    className={`
                        rounded
                        px-2
                        py-1
                        text-white
                        ${speed === 4
                            ? 'bg-blue-600'
                            : 'bg-slate-700'
                        }
                    `}
                >
                    x4
                </button>
                <button
                    type="button"
                    onClick={reset}
                    className="
        rounded
        bg-red-700
        px-3
        py-1
        text-white
    "
                >
                    Reset
                </button>


            </div>

            <InitiativeModal
                open={openInitiative}
                fighters={fighters}
                initiativeResults={initiativeResults}
                onBattleStart={comenzarPelea}
            />

            {/* Turno actual */}
            <div className="mt-5 text-center text-white">
                Turno {playback.currentTurn}
            </div>

            {/* Campo de batalla */}
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
                        {allies.map(fighter => (
                            <FightFighterCard
                                key={fighter.fighterId}
                                fighter={fighter}
                                fighters={fightersState}
                                isCurrentActor={playback.currentActorId === fighter.fighterId}
                                isCurrentTarget={playback.currentTargetId === fighter.fighterId}
                                selectedAction={playback.currentActorId === fighter.fighterId
                                    ? playback.currentAction
                                    : undefined
                                }
                                animation={playback.animation}
                            />
                        ))}
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
                        {enemies.map(fighter => (
                            <FightFighterCard
                                key={fighter.fighterId}
                                fighter={fighter}
                                fighters={fightersState}
                                isCurrentActor={playback.currentActorId === fighter.fighterId}
                                isCurrentTarget={playback.currentTargetId === fighter.fighterId}
                                selectedAction={
                                    playback.currentActorId === fighter.fighterId
                                        ? playback.currentAction
                                        : undefined
                                }
                                animation={playback.animation}
                            />
                        ))}
                    </div>
                </div>

            </section>
        </section>
    );
};