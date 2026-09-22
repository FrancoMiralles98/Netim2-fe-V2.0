import {
    useEffect,
    useMemo,
    useState
} from 'react'
import { InitiativeSide } from './InitiativeSide'

export type FighterSide = 'allies' | 'enemies'

export interface FighterInitiativeResult {
    fighterId: string
    diceRoll: number
    tieBreakerRoll?: number
    total: number
}

export interface FightFighter {
    fighterId: string
    name: string
    side: FighterSide
}

export interface InitiativeModalProps {
    open: boolean
    fighters: FightFighter[]
    initiativeResults: FighterInitiativeResult[]
    onBattleStart: () => void
}

export type InitiativePhase =
    | 'rolling'
    | 'winner'

export const InitiativeModal = ({
    open,
    fighters,
    initiativeResults,
    onBattleStart
}: InitiativeModalProps) => {
    const [phase, setPhase] =
        useState<InitiativePhase>('rolling')

    const fighterById = useMemo(() => {
        return new Map(
            fighters.map(fighter => [
                fighter.fighterId,
                fighter
            ])
        )
    }, [fighters])

    const alliesResults = useMemo(() => {
        return initiativeResults.filter(result => {
            return (
                fighterById.get(result.fighterId)?.side ===
                'allies'
            )
        })
    }, [initiativeResults, fighterById])

    const enemiesResults = useMemo(() => {
        return initiativeResults.filter(result => {
            return (
                fighterById.get(result.fighterId)?.side ===
                'enemies'
            )
        })
    }, [initiativeResults, fighterById])

    /**
     * Como initiativeResults ya viene ordenado por
     * el backend, el primero es quien ganó.
     */
    const initiativeWinner =
        initiativeResults[0]

    const winnerFighter = initiativeWinner
        ? fighterById.get(initiativeWinner.fighterId)
        : undefined

    const winningSide =
        winnerFighter?.side

    useEffect(() => {
        if (!open) {
            return
        }

        setPhase('rolling')

        const fighterCount =
            initiativeResults.length

        /**
         * Cada fighter tarda un poco más
         * que el anterior en revelar su tirada.
         */
        const totalAnimationTime =
            900 + fighterCount * 250

        const timeout = window.setTimeout(() => {
            setPhase('winner')
        }, totalAnimationTime + 500)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [open, initiativeResults])

    if (!open) {
        return null
    }

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
            "
        >
            <div
                className="
                    w-full max-w-4xl
                    rounded-2xl
                    border border-white/10
                    bg-slate-950
                    p-8
                    shadow-2xl
                "
            >
                <header className="mb-8 text-center">
                    <h2
                        className="
                            text-3xl
                            font-bold
                            text-white
                        "
                    >
                        Iniciativa
                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-400
                        "
                    >
                        Determinando quién comienza
                        la batalla...
                    </p>
                </header>

                <div
                    className="
                        grid grid-cols-[1fr_auto_1fr]
                        gap-8
                    "
                >
                    <InitiativeSide
                        side="allies"
                        results={alliesResults}
                        fighterById={fighterById}
                        winningSide={winningSide}
                        showWinner={phase === 'winner'}
                    />

                    <div
                        className="
                            flex items-center
                            text-xl font-black
                            text-slate-500
                        "
                    >
                        VS
                    </div>

                    <InitiativeSide
                        side="enemies"
                        results={enemiesResults}
                        fighterById={fighterById}
                        winningSide={winningSide}
                        showWinner={phase === 'winner'}
                    />
                </div>

                <div
                    className="
                        mt-5
                        flex min-h-24
                        items-center
                        justify-center
                    "
                >
                    {phase === 'winner' && (
                        <div
                            className="
                                animate-[pulse_0.8s_ease-in-out]
                                text-center
                            "
                        >


                            <h3 className=" mt-1 text-3xl font-black text-white">
                                {winningSide === 'allies'
                                    ? '¡Los aliados comienzan!'
                                    : '¡Los enemigos comienzan!'}
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-slate-400
                                "
                            >
                                {
                                    winnerFighter?.name
                                } obtuvo la iniciativa
                                más alta
                            </p>

                            <button
                                type="button"
                                onClick={onBattleStart}
                                className="
                                    mt-6
                                    rounded-lg
                                    bg-yellow-500
                                    px-6 py-3
                                    font-bold
                                    text-black
                                    transition
                                    hover:scale-105
                                    hover:bg-yellow-400
                                "
                            >
                                Comenzar batalla
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}