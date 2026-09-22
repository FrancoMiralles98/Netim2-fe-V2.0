import { FightSkills } from "./components/FightSkills";
import { FightFighterIcon } from "./components/icons/FightFighterIcon";
import { LiquidResourceIndicator } from "./components/LiquidResourceIndicator";
import type { FightFighterState } from "./fighter-state";

export interface FighterCardContentProps {
    fighter: FightFighterState;
    hpPercent: number;
    manaPercent: number;
}

export const CompactFighterCard = ({
    fighter
}: FighterCardContentProps) => {

    return (
        <div className="flex items-center justify-between gap-2">

            {/* Icono */}
            <FightFighterIcon
                fighterName={fighter.name}
            />

            <LiquidResourceIndicator
                current={fighter.resources.hp.current}
                max={fighter.resources.hp.max}
                variant="hp"
            />

            <LiquidResourceIndicator
                current={fighter.resources.mana.current}
                max={fighter.resources.mana.max}
                variant="mana"
            />

            <FightSkills
                skills={fighter.skills}
                cooldowns={fighter.cooldowns}
                variant="compact"
            />
        </div>
    );
};
