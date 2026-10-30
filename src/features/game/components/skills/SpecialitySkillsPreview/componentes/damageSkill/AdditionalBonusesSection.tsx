import type { SkillDamage } from "netim2-shared";

const MECHANICS_EFFECT_NAMES = {
    vampirismo_hechizo: "Vampirismo de hechizo",
    penetracion_habilidad: "Penetración de habilidad",
} as const;

export const AdditionalBonusesSection = ({ skill }: { skill: SkillDamage }) => (
    <div className="space-y-2">
        <p className="text-sky-200">Bonus adicionales</p>
        {Object.entries(skill.escalado.mechanicsEffectScaling ?? {}).map(([effect, scaling]) => (
            <p key={effect} className="text-sm">
                {MECHANICS_EFFECT_NAMES[effect as keyof typeof MECHANICS_EFFECT_NAMES]}: <span className="text-emerald-200">+{skill.mechanicsEffects?.[effect as keyof typeof MECHANICS_EFFECT_NAMES] ?? scaling.base}%</span>
            </p>
        ))}
    </div>
);
