import type { CombatAction } from "netim2-shared";
import type { FightFighterState } from "../../card/fighter-state";
import { getFightActionDisplay } from "../utils/animation-utils";

export interface FightActionIndicatorProps {
    fighter: FightFighterState;
    action: CombatAction;
}

export const FightActionIndicator = ({
    fighter,
    action
}: FightActionIndicatorProps) => {

    const actionDisplay = getFightActionDisplay(
        fighter,
        action
    );

    if (!actionDisplay) {
        return null;
    }

    return (
        <div
            className="
                pointer-events-none
                absolute
                -top-16
                left-1/2
                z-50

                flex
                -translate-x-1/2
                flex-col
                items-center
                gap-1
            "
        >
            <div
                className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-lg
                    border
                    border-yellow-400/70
                    bg-slate-950

                    shadow-[0_0_16px_rgba(250,204,21,0.35)]
                "
            >
                <img
                    src={actionDisplay.icon}
                    alt={actionDisplay.name}
                    className="
                        h-8
                        w-8
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
                    font-bold
                    text-yellow-300
                "
            >
                {actionDisplay.name}
            </span>
        </div>
    );
};