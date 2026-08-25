import type { CombatAction } from "netim2-shared";
import type { FightFighterState } from "../../card/fighter-state";
import { getFightActionDisplay } from "../utils/animation-utils";

interface FightActionIndicatorProps {
    fighter: FightFighterState;
    action: CombatAction;
}

export const FightActionIndicator = ({
    fighter,
    action
}: FightActionIndicatorProps) => {

    const display =
        getFightActionDisplay(
            fighter,
            action
        );

    if (!display) {
        return null;
    }

    return (
        <div
            className="
                absolute
                -top-14
                left-1/2
                z-50
                flex
                -translate-x-1/2
                flex-col
                items-center
                gap-1
                pointer-events-none
            "
        >
            <div
                className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-yellow-400
                    bg-slate-950
                    shadow-[0_0_16px_rgba(250,204,21,0.45)]
                    animate-pulse
                "
            >
                <img
                    src={display.icon}
                    alt={display.name}
                    className="
                        h-7
                        w-7
                        object-contain
                    "
                />
            </div>

            <span
                className="
                    whitespace-nowrap
                    rounded
                    bg-slate-950/95
                    px-2
                    py-0.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-yellow-300
                "
            >
                {display.name}
            </span>
        </div>
    );
};