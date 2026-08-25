import { FightEffectTooltip } from "../modals/FightEffectToolTip";
import type { FightStatusEffectState } from "../../fighter-state";

interface FightStatusEffectStacksIconProps {
    effect: FightStatusEffectState;
    icon: string;
    name: string;
}

export const FightStatusEffectStacksIcon = ({
    effect,
    icon,
    name
}: FightStatusEffectStacksIconProps) => {
    if (!effect.stacks) {
        return null;
    }

    const {
        current,
        toApplyExtraDamage
    } = effect.stacks;

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
                    
                    bg-slate-950
                "
            >
                <img
                    src={icon}
                    alt={`${name} stacks`}
                    className="object-contain"
                />

                {/* Stacks actuales */}
                <span
                    className="
                        absolute
                        -right-1
                        -top-1
                        min-w-[15px]
                        rounded-full
                        bg-orange-950
                        px-1
                        text-center
                        text-[9px]
                        font-bold
                        leading-[15px]
                        text-orange-200
                        ring-1
                        ring-orange-700
                    "
                >
                    {current}
                </span>
            </div>

            <FightEffectTooltip>
                <p className="font-semibold text-orange-300">
                    Acumulaciones de {name}
                </p>

                <div className="mt-2 space-y-1">

                    <p>
                        Acumulaciones:{' '}
                        <span className="text-white">
                            {current} / {toApplyExtraDamage}
                        </span>
                    </p>

                    <p className="text-slate-400">
                        Al alcanzar{' '}
                        <span className="font-semibold text-orange-300">
                            {toApplyExtraDamage}
                        </span>{' '}
                        acumulaciones aplica daño extra.
                    </p>

                </div>
            </FightEffectTooltip>

        </div>
    );
};