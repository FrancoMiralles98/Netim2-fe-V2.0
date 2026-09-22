import type { FighterCardContentProps } from "./fighter-state";
import { FightResourceBar } from "./components/bars/ResourceBar";
import { FightSkills } from "./components/FightSkills";
import { FightFighterIcon } from "./components/icons/FightFighterIcon";

export const ExpandedFighterCard = ({
    fighter,
    hpPercent,
    manaPercent
}: FighterCardContentProps) => {

    return (
        <>
            {/* Icono */}
            <div className="flex justify-center">
                <FightFighterIcon
                    fighterName={fighter.name}
                />
            </div>

            {/* Nombre */}
            <div className="flex items-center justify-center">
                <h3
                    className="
                        truncate
                        text-base
                        font-semibold
                        text-slate-100
                    "
                    title={fighter.name}
                >
                    {fighter.name}
                </h3>

                {!fighter.alive && (
                    <span
                        className="
                            ml-2
                            text-xs
                            font-semibold
                            uppercase
                            text-red-400
                        "
                    >
                        Derrotado
                    </span>
                )}
            </div>

            {/* Recursos */}
            <div className="space-y-2">
                <FightResourceBar
                    label="HP"
                    current={
                        fighter.resources.hp.current
                    }
                    max={
                        fighter.resources.hp.max
                    }
                    percent={hpPercent}
                    type="hp"
                />

                <FightResourceBar
                    label="MP"
                    current={
                        fighter.resources.mana.current
                    }
                    max={
                        fighter.resources.mana.max
                    }
                    percent={manaPercent}
                    type="mana"
                />
            </div>

            <FightSkills
                skills={fighter.skills}
                cooldowns={fighter.cooldowns}
            />
        </>
    );
};
