import { FightResultSummary } from "./FightResultSummary";
import type { FighterFightSummary } from "./types/fighter-fight-summary.types";

export interface FightResultProps {
    summaries: FighterFightSummary[];
}

export const FightResult = ({
    summaries
}: FightResultProps) => (
    <main
        className="
            mx-auto
            min-h-screen
            w-[90%]
            max-w-6xl
            py-10
        "
    >
        <header className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-wider text-white">
                Resultado de la pelea
            </h1>
            <p className="mt-2 text-sm text-slate-400">
                Rendimiento final de cada luchador
            </p>
        </header>

        <FightResultSummary fighters={summaries} />
    </main>
);

export { FightResultSummary };
export type { FightResultSummaryProps } from "./FightResultSummary";
export type { FighterFightSummary } from "./types/fighter-fight-summary.types";
