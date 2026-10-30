import type { SkillDamage } from "netim2-shared";

export const getStatusEffectBaseDamage = (skill: Pick<SkillDamage, "components">, baseDamageRatio: number) => {
    const baseDamage = skill.components.reduce((total, component) => ({
        min: total.min + component.range.min,
        max: total.max + component.range.max,
    }), { min: 0, max: 0 });

    return {
        min: Math.max(0, Math.floor(baseDamage.min * baseDamageRatio)),
        max: Math.max(0, Math.floor(baseDamage.max * baseDamageRatio)),
    };
};
