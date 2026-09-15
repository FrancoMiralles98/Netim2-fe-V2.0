import type { FightSide } from "netim2-shared";
import { FighterFightResultCard } from "./components/FighterFightResultCard";
import type { FighterFightSummary } from "./types/fighter-fight-summary.types";

export interface FightResultSummaryProps {
    fighters: FighterFightSummary[];
}

const FightResultSide = ({
    side,
    fighters
}: {
    side: FightSide;
    fighters: FighterFightSummary[];
}) => (
    <section>
        <h2
            className={`
                mb-3
                text-xs
                font-bold
                uppercase
                tracking-widest
                ${side === 'allies'
                    ? 'text-blue-400'
                    : 'text-red-400'
                }
            `}
        >
            {side === 'allies' ? 'Aliados' : 'Enemigos'}
        </h2>

        <div className="grid items-start gap-4 sm:grid-cols-2">
            {fighters.map(fighter => (
                <FighterFightResultCard
                    key={fighter.fighterId}
                    fighter={fighter}
                />
            ))}
        </div>
    </section>
);

export const FightResultSummary = ({
    fighters
}: FightResultSummaryProps) => {
    const allies = fighters.filter(
        fighter => fighter.side === 'allies'
    );
    const enemies = fighters.filter(
        fighter => fighter.side === 'enemies'
    );

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <FightResultSide side="allies" fighters={allies} />
            <FightResultSide side="enemies" fighters={enemies} />
        </div>
    );
};
