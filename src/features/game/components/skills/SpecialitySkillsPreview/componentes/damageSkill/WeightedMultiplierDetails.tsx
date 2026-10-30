import type { SkillDamage } from "netim2-shared";
import { DamageAmount } from "./DamageAmount";

interface WeightedMultiplierDetailsProps {
    skill: SkillDamage;
    modifier: Extract<NonNullable<SkillDamage["damageModifiers"]>, { type: "weighted_multiplier" }>;
    criticalDamageMultiplier: number | null;
}

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
const formatRange = ({ min, max }: { min: number; max: number }) => (
    `${numberFormat.format(min)} – ${numberFormat.format(max)}`
);

export const WeightedMultiplierDetails = ({ skill, modifier, criticalDamageMultiplier }: WeightedMultiplierDetailsProps) => {
    const options = modifier.options.filter((option) => option.chance > 0);
    const totalWeight = options.reduce((total, option) => total + option.chance, 0);
    const damageType = skill.components.every((component) => component.damageType === skill.components[0]?.damageType)
        ? skill.components[0]?.damageType : undefined;
    const getDamageRange = (multiplier: number) => skill.components.reduce((total, component) => ({
        min: total.min + Math.max(0, Math.floor(component.range.min * multiplier)),
        max: total.max + Math.max(0, Math.floor(component.range.max * multiplier)),
    }), { min: 0, max: 0 });

    return (
        <div className="space-y-3">
            {options.length === 0 && <p className="text-slate-300">No hay resultados disponibles para este nivel.</p>}
            {options.map((option, index) => {
                const damage = getDamageRange(option.multiplier);
                const criticalDamage = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier)
                    ? getDamageRange(option.multiplier * criticalDamageMultiplier) : null;

                return (
                    <div key={index} className={`space-y-2 ${index > 0 ? "border-t border-slate-500/40 pt-3" : ""}`}>
                        <h5 className="text-sky-200">Daño ×{numberFormat.format(option.multiplier)}</h5>
                        {option.description && <p className="text-slate-300">{option.description}</p>}
                        <p className="text-slate-300">Chances: <span className="text-emerald-200">{numberFormat.format(option.chance / totalWeight * 100)}%</span></p>
                        <p>Daño base amplificado: <DamageAmount value={formatRange(damage)} damageType={damageType} /></p>
                        <p>Daño base amplificado con crítico: <DamageAmount value={criticalDamage ? formatRange(criticalDamage) : "No disponible"} damageType={damageType} /></p>
                    </div>
                );
            })}
        </div>
    );
};
