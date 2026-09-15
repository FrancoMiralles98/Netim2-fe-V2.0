import { CompactResourceBar } from "./components/bars/CompactResourceBar";
import { FightFighterIcon } from "./components/icons/FightFighterIcon";
import type { FightFighterState } from "./fighter-state";

export interface FighterCardContentProps {
    fighter: FightFighterState;
    hpPercent: number;
    manaPercent: number;
}

export const CompactFighterCard = ({
    fighter,
    hpPercent,
    manaPercent
}: FighterCardContentProps) => {

    return (
        <div className="flex items-center gap-2">

            {/* Icono */}
            <FightFighterIcon
                fighterName={fighter.name}
            />

            {/* Barras */}
            <div className="flex-1 space-y-1.5">

                <CompactResourceBar
                    percent={hpPercent}
                    type="hp"
                />

                <CompactResourceBar
                    percent={manaPercent}
                    type="mana"
                />

            </div>
        </div>
    );
};
