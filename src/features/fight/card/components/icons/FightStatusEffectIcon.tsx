import { STATUS_EFFECT_DISPLAY_CONFIG } from "../../../utils/status-effect-display-config";
import { FightEffectTooltip } from "../modals/FightEffectToolTip";
import type { FightStatusEffectState } from "../../fighter-state";
import { FightStatusEffectStacksIcon } from "./FightStatusEffectStacksIcon";

export const FightStatusEffectIcon = ({
    effect,
    sourceName
}: {
    effect: FightStatusEffectState;
    sourceName: string;
}) => {

    const config =
        STATUS_EFFECT_DISPLAY_CONFIG[
        effect.effectId
        ];

    return (
        <div className="flex items-center gap-1">

            {/* Efecto principal */}
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
                        bg-slate-950
                    "
                >
                    <img
                        src={config.icon}
                        alt={config.name}
                        className="object-contain"
                    />

                    {/* Turnos restantes */}
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
                            ring-slate-700
                        "
                    >
                        {effect.remainingTurns}
                    </span>
                </div>

                {/* Tooltip del efecto */}
                <FightEffectTooltip>
                    <p className="font-semibold text-red-300">
                        {config.name}
                    </p>

                    <div className="mt-2 space-y-1">
                        <p>
                            Duración restante:{' '}
                            <span className="text-white">
                                {effect.remainingTurns} turnos
                            </span>
                        </p>

                        <p>
                            Causado por:{' '}
                            <span className="text-white">
                                {sourceName}
                            </span>
                        </p>

                        {effect.damage !== undefined && (
                            <p>
                                Daño:{' '}
                                <span className="text-red-300">
                                    {effect.damage}
                                </span>
                            </p>
                        )}
                    </div>
                </FightEffectTooltip>
            </div>

            {/* Stacks */}
            {effect.stacks && (
                <FightStatusEffectStacksIcon
                    effect={effect}
                    icon={config.icon}
                    name={config.name}
                />
            )}

        </div>
    );
};