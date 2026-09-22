import type {
    LetterMasteryLv,
    UNIQUE_ID_SKILLS
} from "netim2-shared";

export const getSkillIconPath = (
    skillId: UNIQUE_ID_SKILLS,
    mastery: LetterMasteryLv
): string => `/icons/skills/${skillId}${mastery}.png`;
