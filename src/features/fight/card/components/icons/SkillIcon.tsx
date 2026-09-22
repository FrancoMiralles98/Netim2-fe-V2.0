import type { FightSkillCooldown, FightSkillDisplay } from "../../fighter-state";
import { getSkillIconPath } from "../../../../../shared/utils/get-skill-icon-path";

export interface FightSkillIconProps {
    skill: FightSkillDisplay;
    cooldown?: FightSkillCooldown;
    compact?: boolean;
}

export const FightSkillIcon = ({
    skill,
    cooldown,
    compact = false
}: FightSkillIconProps) => {

    const isOnCooldown =
        cooldown !== undefined &&
        cooldown.remainingTurns > 0;

    return (
        <div
            title={skill.name}
            className={`
                relative
                flex
                items-center
                justify-center
                overflow-hidden
                border
                border-slate-700
                bg-slate-800
                ${compact
                    ? 'h-5 w-5 rounded'
                    : 'h-8 w-8 rounded-md'
                }
            `}
        >
            <img
                src={getSkillIconPath(
                    skill.skillId,
                    skill.mastery
                )}
                alt={skill.name}
                className="
                    h-full
                    w-full
                    object-cover
                "
            />

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
                        className={`
                            absolute
                            text-white
                            ${compact
                                ? 'text-[10px]'
                                : 'text-sm'
                            }
                        `}
                    >
                        {cooldown.remainingTurns}
                    </span>
                </>
            )}
        </div>
    );
};
