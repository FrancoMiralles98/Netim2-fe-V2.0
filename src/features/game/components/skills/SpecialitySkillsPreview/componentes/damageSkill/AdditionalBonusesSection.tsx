import type { SkillDamage } from "netim2-shared";
import { SkillNextValue } from "../SkillNextValue";
import { useNextSkill } from "../../skill-upgrade-preview.context";

const MECHANICS_EFFECT_NAMES = {
    vampirismo_hechizo: "Vampirismo de hechizo",
    penetracion_habilidad: "Penetración de habilidad",
} as const;

export const AdditionalBonusesSection = ({ skill }: { skill: SkillDamage }) => {
    const next = useNextSkill();
    const effects = { ...(next?.type === "damage" ? next.mechanicsEffects : {}), ...skill.mechanicsEffects };
    return (
    <div className="space-y-2">
        <p className="text-sky-200">Bonus adicionales</p>
        {Object.keys(effects).length === 0 && (
            <p className="text-sm text-slate-300">No hay bonus adicionales disponibles para este nivel.</p>
        )}
        {Object.keys(effects).map(effect => {
            const key = effect as keyof NonNullable<SkillDamage['mechanicsEffects']>;
            const value = skill.mechanicsEffects?.[key] ?? 0;
            return (
            <p key={effect} className="text-sm">
                {MECHANICS_EFFECT_NAMES[effect as keyof typeof MECHANICS_EFFECT_NAMES]}: <span className="text-emerald-200">{value > 0 ? "+" : ""}{value}%</span>
                <SkillNextValue select={skill => skill.type === "damage" ? `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(skill.mechanicsEffects?.[key] ?? 0)}%` : null} />
            </p>
        ); })}
    </div>
    );
};
