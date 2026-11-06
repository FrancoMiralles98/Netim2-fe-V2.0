import type { SkillDamage } from "netim2-shared";
import { DamageAmount } from "./DamageAmount";
import { SkillNextValue } from "../SkillNextValue";
import { SkillResourceCosts } from "../SkillResourceCosts";
import { DamageScalingTooltip } from "./DamageScalingTooltip";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
const rangeText = (skill: SkillDamage, multiplier = 1) => `${numberFormat.format(Math.floor(skill.components.range.min * multiplier))} – ${numberFormat.format(Math.floor(skill.components.range.max * multiplier))}`;

export const BaseDamageSection = ({ skill, criticalDamageMultiplier }: { skill: SkillDamage; criticalDamageMultiplier: number | null }) => {
    const critical = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier) ? criticalDamageMultiplier : null;
    return <div className="space-y-3 text-sm">
        <h4 className="font-metin text-base text-amber-300">Base</h4>
        <div className="flex flex-wrap items-center gap-2">
            <p>Daño base: <DamageAmount value={rangeText(skill)} damageType={skill.components.damageType} /><SkillNextValue select={value => value.type === "damage" ? rangeText(value) : null} /></p>
            <DamageScalingTooltip scaling={skill.escalado} />
        </div>
        <p>Daño base con crítico: <DamageAmount value={critical === null ? "No disponible" : rangeText(skill, critical)} damageType={skill.components.damageType} /><SkillNextValue select={value => value.type === "damage" && critical !== null ? rangeText(value, critical) : null} /></p>
        <SkillResourceCosts skill={skill} />
    </div>;
};
