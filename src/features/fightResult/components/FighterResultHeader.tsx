import { FightFighterIcon } from "../../fight/card/components/icons/FightFighterIcon";
import type { FighterFightSummary } from "../types/fighter-fight-summary.types";
import { formatStatisticValue } from "../utils/statistics-bar.utils";

export interface FighterResultHeaderProps {
    fighter: FighterFightSummary;
}

export const FighterResultHeader = ({
    fighter
}: FighterResultHeaderProps) => (
    <header className="flex items-center gap-3">
        <FightFighterIcon fighterName={fighter.name} />

        <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
                <h3
                    className="truncate text-base font-semibold text-slate-100"
                    title={fighter.name}
                >
                    {fighter.name}
                </h3>
                <span
                    className={`
                        rounded-full
                        border
                        px-2
                        py-0.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        ${fighter.alive
                            ? 'border-green-700 bg-green-950/60 text-green-300'
                            : 'border-red-800 bg-red-950/60 text-red-300'
                        }
                    `}
                >
                    {fighter.alive ? 'Vivo' : 'Derrotado'}
                </span>
            </div>

            <div className="mt-2 flex gap-2 text-xs">
                <span className="rounded border border-red-900/70 bg-red-950/40 px-2 py-1 text-red-300">
                    HP{' '}
                    <strong className="tabular-nums text-slate-100">
                        {formatStatisticValue(fighter.resources.hp)}
                    </strong>
                </span>
                <span className="rounded border border-blue-900/70 bg-blue-950/40 px-2 py-1 text-blue-300">
                    MP{' '}
                    <strong className="tabular-nums text-slate-100">
                        {formatStatisticValue(fighter.resources.mana)}
                    </strong>
                </span>
            </div>
        </div>
    </header>
);
