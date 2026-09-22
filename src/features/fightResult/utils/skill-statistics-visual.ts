import type { UNIQUE_ID_SKILLS } from "netim2-shared";
import { getSkillIconPath } from "../../../shared/utils/get-skill-icon-path";
import type { FighterFightSummarySkill } from "../types/fighter-fight-summary.types";

export interface SkillStatisticVisual {
    label: string;
    icon?: string;
}

export const getSkillStatisticVisual = (
    skillId: UNIQUE_ID_SKILLS,
    skills: FighterFightSummarySkill[]
): SkillStatisticVisual => {
    const skill = skills.find(
        current => current.skillId === skillId
    );

    if (!skill) {
        return { label: 'Habilidad' };
    }

    return {
        label: skill.name,
        icon: getSkillIconPath(
            skill.skillId,
            skill.mastery
        )
    };
};
