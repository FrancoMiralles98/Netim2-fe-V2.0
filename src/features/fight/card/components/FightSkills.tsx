import type {
    FightSkillCooldown,
    FightSkillDisplay
} from "../fighter-state";
import { FightSkillIcon } from "./icons/SkillIcon";

export interface FightSkillsProps {
    skills: FightSkillDisplay[];
    cooldowns: FightSkillCooldown[];
    variant?: 'compact' | 'expanded';
}

export const FightSkills = ({
    skills,
    cooldowns,
    variant = 'expanded'
}: FightSkillsProps) => {
    if (skills.length === 0) {
        return null;
    }

    const isCompact = variant === 'compact';

    return (
        <section
            aria-label="Habilidades"
            className={
                isCompact
                    ? 'shrink-0'
                    : 'mt-3 text-white'
            }
        >
            {!isCompact && (
                <h1 className="text-sm">
                    Habilidades
                </h1>
            )}

            <div
                className={`
                    ${isCompact
                        ? 'grid grid-cols-3 gap-1'
                        : `
                            flex
                            flex-wrap
                            justify-center
                            gap-2
                            border-t
                            border-white
                            pt-3
                        `
                    }
                `}
            >
                {skills.map(skill => {
                    const cooldown = cooldowns.find(
                        currentCooldown =>
                            currentCooldown.skillId ===
                            skill.skillId
                    );

                    return (
                        <FightSkillIcon
                            key={skill.skillId}
                            skill={skill}
                            cooldown={cooldown}
                            compact={isCompact}
                        />
                    );
                })}
            </div>
        </section>
    );
};
