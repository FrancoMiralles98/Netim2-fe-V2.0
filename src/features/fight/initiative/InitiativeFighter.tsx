import { NetimText } from "../../../shared/typography/components/NetimText"
import type { FighterInitiativeResult, FightFighter } from "./InitiativeModal"
import { InitiativeRoll } from "./InitiativeRoll"

interface InitiativeFighterProps {
    fighter: FightFighter
    result: FighterInitiativeResult
    delay: number
    winner: boolean
}

export const InitiativeFighter = ({
    fighter,
    result,
    delay,
    winner
}: InitiativeFighterProps) => {
    return (
        <div
            className={`
                flex items-center
                justify-between
                rounded-lg
                border
                p-2
                transition-all
                duration-500

                ${winner
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-white/10 bg-white/5'
                }
            `}
        >
            <div className="flex">
                <NetimText cssAditionals="text-sm!" text={fighter.name}/>
            </div>

            <InitiativeRoll
                value={result.diceRoll}
                delay={delay}
                breakerRoll={result.tieBreakerRoll}
            />
        </div>
    )
}