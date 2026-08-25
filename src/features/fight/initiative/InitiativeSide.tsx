import { InitiativeFighter } from "./InitiativeFighter"
import type { FighterInitiativeResult, FighterSide, FightFighter } from "./InitiativeModal"

export interface InitiativeSideProps {
    side: FighterSide

    results: FighterInitiativeResult[]

    fighterById: Map<string, FightFighter>

    winningSide?: FighterSide

    showWinner: boolean
}

export const InitiativeSide = ({
    side,
    results,
    fighterById,
    winningSide,
    showWinner
}: InitiativeSideProps) => {
    const isWinner =
        showWinner && winningSide === side

    return (
        <section
            className={`
                rounded-xl
                border
                p-5
                transition-all
                duration-500

                ${isWinner
                    ? 'scale-[1.03] border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.15)]'
                    : 'border-white/10'
                }
            `}
        >
            <h3
                className={`
                    mb-5 text-center
                    text-xl font-bold

                    ${side === 'allies'
                        ? 'text-blue-400'
                        : 'text-red-400'
                    }
                `}
            >
                {side === 'allies'
                    ? 'Aliados'
                    : 'Enemigos'}
            </h3>

            <div className="space-y-4">
                {results.map(
                    (result, index) => {
                        const fighter =
                            fighterById.get(
                                result.fighterId
                            )

                        if (!fighter) {
                            return null
                        }

                        return (
                            <InitiativeFighter
                                key={result.fighterId}
                                fighter={fighter}
                                result={result}
                                delay={
                                    900 +
                                    index * 250
                                }
                                winner={
                                    showWinner &&
                                    winningSide ===
                                    side &&
                                    index === 0
                                }
                            />
                        )
                    }
                )}
            </div>
        </section>
    )
}