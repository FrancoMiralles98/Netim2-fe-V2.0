import type { LetterMasteryLv, SkillType } from "netim2-shared";

export const MASTERY_LEVELS: LetterMasteryLv[] = ["N", "M", "G", "P"];

export const formatManaCost = (mana: SkillType["mana"]): string => {
    if (mana.type === "none") return "Sin coste";
    if (mana.type === "instant") return `${mana.amount} PM`;
    return `${mana.initialAmount ?? 0} PM iniciales · ${mana.amountPerTurn} PM/turno`;
};

export const formatCooldown = (skill: SkillType): string => {
    const { onActivate, onDeactivate } = skill.cd;
    if (onActivate === undefined && onDeactivate === undefined) return "Sin enfriamiento";
    return [
        onActivate !== undefined ? `${onActivate} turnos al usar` : null,
        onDeactivate !== undefined ? `${onDeactivate} turnos al desactivar` : null,
    ].filter(Boolean).join(" · ");
};
