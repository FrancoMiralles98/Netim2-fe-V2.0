import type { FightSkillCooldown, FightSkillDisplay } from "../../fighter-state";

export interface FightSkillIconProps {
    skill: FightSkillDisplay;
    cooldown?: FightSkillCooldown;
}

export const FightSkillIcon = ({
    skill,
    cooldown
}: FightSkillIconProps) => {

    const isOnCooldown =
        cooldown !== undefined &&
        cooldown.remainingTurns > 0;

    return (
        <div
            title={skill.name}
            className="
                relative
                flex
                h-8
                w-8
                items-center
                justify-center
                overflow-hidden
                rounded-md
                border
                border-slate-700
                bg-slate-800
            "
        >
            {skill.icon ? (
                <img
                    src={skill.icon}
                    alt={skill.name}
                    className="
                        h-full
                        w-full
                        object-cover
                    "
                />
            ) : (
                <span className="text-xs text-slate-500">
                    ?
                </span>
            )}

            {isOnCooldown && (
                <>
                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/60
                        "
                    />

                    <span
                        className="
                            absolute
                            text-sm
                            text-white
                        "
                    >
                        {cooldown.remainingTurns}
                    </span>
                </>
            )}
        </div>
    );
};