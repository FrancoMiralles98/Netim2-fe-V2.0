import type { FightResult } from "netim2-shared";
import type { FightFighterState } from "../../card/fighter-state";

export interface FightResultModalProps {
    result: FightResult | null;
    fighters: FightFighterState[];

    onClose: () => void;
}

export const FightResultModal = ({
    result,
    fighters,
    onClose
}: FightResultModalProps) => {

    if (!result) {
        return null;
    }

    const winnerNames =
        result.winnerFighterIds
            ?.map(fighterId =>
                fighters.find(
                    fighter =>
                        fighter.fighterId === fighterId
                )?.name
            )
            .filter(
                (name): name is string =>
                    Boolean(name)
            ) ?? [];

    const winnerFighter =
        result.winnerFighterId
            ? fighters.find(
                fighter =>
                    fighter.fighterId ===
                    result.winnerFighterId
            )
            : undefined;

    const getResultTitle = (): string => {

        if (result.outcome === 'draw') {
            return 'EMPATE';
        }

        if (result.winnerSide === 'allies') {
            return 'VICTORIA';
        }

        if (result.winnerSide === 'enemies') {
            return 'DERROTA';
        }

        return 'PELEA FINALIZADA';
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[200]

                flex
                items-center
                justify-center

                bg-black/70
                backdrop-blur-sm
            "
        >
            <div
                className="
                    w-[420px]
                    max-w-[90%]

                    rounded-xl
                    border
                    border-slate-700

                    bg-slate-950

                    p-6

                    text-center
                    text-white

                    shadow-2xl
                "
            >
                <h2
                    className={`
                        text-3xl
                        font-black
                        tracking-wider

                        ${
                            result.outcome === 'draw'
                                ? 'text-slate-300'
                                : result.winnerSide === 'allies'
                                    ? 'text-yellow-300'
                                    : 'text-red-400'
                        }
                    `}
                >
                    {getResultTitle()}
                </h2>

                {result.outcome === 'winner' && (
                    <div className="mt-5">

                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-widest
                                text-slate-500
                            "
                        >
                            Ganador
                        </p>

                        {winnerNames.length > 0 ? (
                            <div
                                className="
                                    mt-2
                                    flex
                                    flex-col
                                    gap-1

                                    text-lg
                                    font-bold
                                    text-white
                                "
                            >
                                {winnerNames.map(name => (
                                    <span key={name}>
                                        {name}
                                    </span>
                                ))}
                            </div>
                        ) : winnerFighter ? (
                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-bold
                                "
                            >
                                {winnerFighter.name}
                            </p>
                        ) : (
                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-bold
                                "
                            >
                                {result.winnerSide === 'allies'
                                    ? 'Allies'
                                    : 'Enemies'
                                }
                            </p>
                        )}

                    </div>
                )}

                <div
                    className="
                        mt-5
                        border-t
                        border-slate-800
                        pt-4
                    "
                >
                    <p className="text-sm text-slate-400">
                        Finalizó en el turno{' '}
                        <span className="font-semibold text-white">
                            {result.finishedOnTurn}
                        </span>
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        mt-6
                        w-full

                        rounded-lg

                        bg-slate-800
                        px-4
                        py-2

                        font-semibold
                        text-white

                        transition

                        hover:bg-slate-700
                    "
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};