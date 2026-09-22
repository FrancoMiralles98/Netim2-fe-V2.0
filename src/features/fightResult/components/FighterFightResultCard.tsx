import type { FighterFightSummary } from "../types/fighter-fight-summary.types";
import { FighterResultHeader } from "./FighterResultHeader";
import { FighterStatistics } from "./FighterStatistics";

export interface FighterFightResultCardProps {
    fighter: FighterFightSummary;
}

export const FighterFightResultCard = ({
    fighter
}: FighterFightResultCardProps) => (
    <article
        className={`
            rounded-lg
            border
            bg-slate-900
            p-3
            shadow-lg
            ${fighter.alive
                ? 'border-slate-700'
                : 'border-red-950'
            }
        `}
    >
        <FighterResultHeader fighter={fighter} />
        <FighterStatistics
            statistics={fighter.statistics}
            skills={fighter.skills}
        />
    </article>
);
