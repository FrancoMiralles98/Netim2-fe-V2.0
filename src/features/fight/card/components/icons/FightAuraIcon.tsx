import { FightEffectTooltip } from "../modals/FightEffectToolTip";
import type { FightAuraState } from "../../fighter-state";

export const FightAuraIcon = ({
    aura,
    sourceName
}: {
    aura: FightAuraState;
    sourceName: string;
}) => {

    return (
        <div className="group relative">

            <div
                className="
                    relative
                    flex
                    h-[27px]
                    w-[27px]
                    items-center
                    justify-center
                    rounded
                    border
                    border-purple-700
                    bg-slate-950
                "
            >
                <img
                    src={''}
                    alt={aura.name}
                    className="h-5 w-5 object-contain"
                />

                {aura.remainingTurns !== undefined && (
                    <span
                        className="
                            absolute
                            -right-1
                            -top-1
                            min-w-[15px]
                            rounded-full
                            bg-slate-950
                            px-1
                            text-center
                            text-[9px]
                            font-bold
                            leading-[15px]
                            text-white
                            ring-1
                            ring-purple-700
                        "
                    >
                        {aura.remainingTurns}
                    </span>
                )}
            </div>

            <FightEffectTooltip>
                <p className="font-semibold text-purple-300">
                    {aura.name}
                </p>

                <div className="mt-2 space-y-1">
                    <p>
                        Causado por:{' '}
                        <span className="text-white">
                            {sourceName}
                        </span>
                    </p>

                    {aura.remainingTurns !== undefined && (
                        <p>
                            Duración:{' '}
                            <span className="text-white">
                                {aura.remainingTurns} turnos
                            </span>
                        </p>
                    )}
                </div>
            </FightEffectTooltip>

        </div>
    );
};