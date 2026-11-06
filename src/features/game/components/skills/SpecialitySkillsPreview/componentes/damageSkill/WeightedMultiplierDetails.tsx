import type { SkillDamage } from "netim2-shared";
import { DamageAmount } from "./DamageAmount";
import { NextValue } from "../SkillNextValue";
import { useNextSkill } from "../../skill-upgrade-preview.context";

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
    const preview = useNextSkill();
    const next = preview?.type === "damage" && preview.damageModifiers?.type === "weighted_multiplier" ? preview : null;
    const nextOptions = next?.damageModifiers?.type === "weighted_multiplier" ? next.damageModifiers.options.filter(option => option.chance > 0) : [];
    const nextWeight = nextOptions.reduce((sum, option) => sum + option.chance, 0);
    const options = modifier.options.filter((option) => option.chance > 0);
    const totalWeight = options.reduce((total, option) => total + option.chance, 0);
    const damageType = skill.components.damageType;
    const getDamageRange = (multiplier: number) => ({
        min: Math.max(0, Math.floor(skill.components.range.min * multiplier)),
        max: Math.max(0, Math.floor(skill.components.range.max * multiplier)),
    });

    return (
        <div className="space-y-3">
            {options.length === 0 && <p className="text-slate-300">No hay resultados disponibles para este nivel.</p>}
            {options.map((option, index) => {
                const nextOption = nextOptions[index];
                const nextDamage = next && nextOption ? {
                    min: Math.floor(next.components.range.min * nextOption.multiplier),
                    max: Math.floor(next.components.range.max * nextOption.multiplier),
                } : null;
                const nextCritical = next && nextOption && criticalDamageMultiplier !== null ? {
                    min: Math.floor(next.components.range.min * nextOption.multiplier * criticalDamageMultiplier),
                    max: Math.floor(next.components.range.max * nextOption.multiplier * criticalDamageMultiplier),
                } : null;
                const damage = getDamageRange(option.multiplier);
                const criticalDamage = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier)
                    ? getDamageRange(option.multiplier * criticalDamageMultiplier) : null;

                return (
                    <div key={index} className={`space-y-2 ${index > 0 ? "border-t border-slate-500/40 pt-3" : ""}`}>
                        <h5 className="text-sky-200">Daño ×{numberFormat.format(option.multiplier)}<NextValue current={option.multiplier} next={nextOption?.multiplier} /></h5>
                        {option.description && <p className="text-slate-300">{option.description}</p>}
                        <p className="text-slate-300">Chances: <span className="text-emerald-200">{numberFormat.format(option.chance / totalWeight * 100)}%</span><NextValue current={`${numberFormat.format(option.chance / totalWeight * 100)}%`} next={nextOption && nextWeight > 0 ? `${numberFormat.format(nextOption.chance / nextWeight * 100)}%` : null} /></p>
                        <p>Daño base amplificado: <DamageAmount value={formatRange(damage)} damageType={damageType} /><NextValue current={formatRange(damage)} next={nextDamage ? formatRange(nextDamage) : null} /></p>
                        <p>Daño base amplificado con crítico: <DamageAmount value={criticalDamage ? formatRange(criticalDamage) : "No disponible"} damageType={damageType} /><NextValue current={criticalDamage ? formatRange(criticalDamage) : null} next={nextCritical ? formatRange(nextCritical) : null} /></p>
                    </div>
                );
            })}
        </div>
    );
};
