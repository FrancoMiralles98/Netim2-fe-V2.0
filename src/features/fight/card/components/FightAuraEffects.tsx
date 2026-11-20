import type { FightFighterState } from "../fighter-state";
import { getAuraEffect } from "../../animations/aura-effects";
import { SpritesheetEffect } from "../../../../shared/animations/spritesheet/SpritesheetEffect";

export interface FightAuraEffectsProps {
    fighter: FightFighterState;
    paused?: boolean;
    speed?: number;
}

export const FightAuraEffects = ({
    fighter,
    paused = false,
    speed = 1,
}: FightAuraEffectsProps) => (
    <div aria-hidden="true" className="pointer-events-none absolute -inset-x-6 -inset-y-4 z-20">
        {[...fighter.activeAuras.values()].map(aura => {
            const sheet = getAuraEffect(aura.auraId);
            if (
                !sheet ||
                aura.sourceFighterId !== fighter.fighterId ||
                (aura.remainingTurns !== undefined && aura.remainingTurns <= 0)
            ) {
                return null;
            }

            return (
                <SpritesheetEffect
                    key={aura.auraId}
                    sheet={sheet}
                    paused={paused}
                    speed={speed}
                    direction={sheet.direction}
                    loop
                    style={sheet.cardBounds ? {
                        position: "absolute",
                        left: `calc(24px - (100% - 48px) * ${sheet.cardBounds.left / sheet.cardBounds.width})`,
                        top: `calc(16px - (100% - 32px) * ${sheet.cardBounds.top / sheet.cardBounds.height})`,
                        width: `calc((100% - 48px) / ${sheet.cardBounds.width})`,
                        height: `calc((100% - 32px) / ${sheet.cardBounds.height})`,
                    } : {
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        height: `calc((100% - 24px) / ${sheet.contentHeightRatio ?? 1})`,
                        transform: "translateY(-50%)",
                    }}
                />
            );
        })}
    </div>
);
