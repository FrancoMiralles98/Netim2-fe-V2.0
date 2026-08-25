import { getIconRace } from "../../characterSelection/utils/character-selecition-utils";
import type { FighterCardContentProps } from "./fighter-state";
import { FightResourceBar } from "./components/bars/ResourceBar";
import { FightSkillIcon } from "./components/icons/SkillIcon";

export const ExpandedFighterCard = ({
    fighter,
    hpPercent,
    manaPercent
}: FighterCardContentProps) => {

    return (
        <>
            {/* Icono */}
            <div className="flex justify-center">
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
                    style={{
                        backgroundPosition: '0px 0px'
                    }}
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

            {/* Habilidades */}
            {fighter.skills.length > 0 && (
                <section className="mt-3 text-white">

                    <h1 className="text-sm">
                        Habilidades
                    </h1>

                    <div
                        className="
                            flex
                            flex-wrap
                            justify-center
                            gap-2
                            border-t
                            border-white
                            pt-3
                        "
                    >
                        {fighter.skills.map(skill => {

                            const cooldown =
                                fighter.cooldowns.find(
                                    cooldown =>
                                        cooldown.skillId ===
                                        skill.skillId
                                );

                            return (
                                <FightSkillIcon
                                    key={skill.skillId}
                                    skill={skill}
                                    cooldown={cooldown}
                                />
                            );
                        })}
                    </div>
                </section>
            )}
        </>
    );
};