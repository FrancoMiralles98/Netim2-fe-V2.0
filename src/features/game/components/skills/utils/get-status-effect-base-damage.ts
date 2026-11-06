import type { SkillDamage } from "netim2-shared";

export const getStatusEffectBaseDamage = (skill: Pick<SkillDamage, "components">, baseDamageRatio: number) => {
    const baseDamage = skill.components.range;

    return {
        min: Math.max(0, Math.floor(baseDamage.min * baseDamageRatio)),
        max: Math.max(0, Math.floor(baseDamage.max * baseDamageRatio)),
    };
};
