import { getIconRace } from "../../characterSelection/utils/character-selecition-utils";
import { CompactResourceBar } from "./components/bars/CompactResourceBar";
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
            <img
                src={getIconRace(
                    'guerrero',
                    'masculino'
                )}
                className="
                    h-[40px]
                    min-w-[41px]
                    max-w-[41px]
                    overflow-hidden
                    bg-[url('/characterSelection/icons_perfil.png')]
                    bg-cover
                    bg-no-repeat
                "
                alt={fighter.name}
                title={fighter.name}
                style={{
                    backgroundPosition: '0px 0px'
                }}
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