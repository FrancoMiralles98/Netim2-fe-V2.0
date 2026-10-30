import type { SkillDamage } from "netim2-shared";
import { COMBAT_COLORS } from "../../../../../../../shared/colors/combat-colors";
import { getSkillHitDamage } from "../../../utils/get-skill-hit-damage";
import { DamageAmount } from "./DamageAmount";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
const formatRange = ({ min, max }: { min: number; max: number }) => (
    `${numberFormat.format(min)} – ${numberFormat.format(max)}`
);

interface MultiHitSectionProps {
    skill: SkillDamage;
    criticalDamageMultiplier: number | null;
}

const ChanceMultiHitDetails = ({ skill, criticalDamageMultiplier }: MultiHitSectionProps) => {
    const modifier = skill.hitModifiers;
    if (modifier?.type !== "chance_multi_hit") return null;

    const hits = Math.max(1, Math.floor(modifier.hits));
    const multiplier = Math.max(0, modifier.damageMultiplierPerHit);
    const chance = Math.min(100, Math.max(0, modifier.chance));
    const totalDamage = skill.components.reduce((total, component) => ({
        min: total.min + Math.floor(component.range.min * multiplier) * hits,
        max: total.max + Math.floor(component.range.max * multiplier) * hits,
    }), { min: 0, max: 0 });
    const criticalTotal = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier)
        ? skill.components.reduce((total, component) => ({
            min: total.min + Math.floor(component.range.min * multiplier * criticalDamageMultiplier) * hits,
            max: total.max + Math.floor(component.range.max * multiplier * criticalDamageMultiplier) * hits,
        }), { min: 0, max: 0 }) : null;
    const damageType = skill.components.every((component) => component.damageType === skill.components[0]?.damageType)
        ? skill.components[0]?.damageType : undefined;

    return (
        <section className="space-y-2">
            <h4 className="font-metin text-base text-amber-300">Multi Golpe</h4>
            <dl className="space-y-2 font-sans text-sm text-slate-300">
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt>Chances de ocasionar multi golpes:</dt>
                    <dd className="text-emerald-200">{numberFormat.format(chance)}%</dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt>Cantidad de golpes a efectuar:</dt>
                    <dd className="text-emerald-200">{hits}</dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt>% Daño Base por golpe:</dt>
                    <dd className={damageType ? COMBAT_COLORS[damageType].text : ""}>{numberFormat.format(multiplier * 100)}%</dd>
                </div>
            </dl>
            <p className="text-sm">Daño potencial total: <DamageAmount value={`${numberFormat.format(totalDamage.min)} – ${numberFormat.format(totalDamage.max)}`} damageType={damageType} /></p>
            <p className="text-sm">Daño potencial total con crítico: <DamageAmount
                value={criticalTotal ? `${numberFormat.format(criticalTotal.min)} – ${numberFormat.format(criticalTotal.max)}` : "No disponible"}
                damageType={damageType}
            /></p>
        </section>
    );
};

const HitDamageOutcomes = ({ skill, criticalDamageMultiplier }: MultiHitSectionProps) => {
    const outcomes = getSkillHitDamage(skill);
    const criticalOutcomes = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier)
        ? getSkillHitDamage(skill, criticalDamageMultiplier) : null;
    const damageType = skill.components.every((component) => component.damageType === skill.components[0]?.damageType)
        ? skill.components[0]?.damageType : undefined;

    return (
        <div className="space-y-2">
            <h4 className="font-metin text-base text-amber-300">Multi Golpe</h4>
            {outcomes.map((outcome, index) => (
                <div key={index} className={`space-y-2 ${index > 0 ? "border-t border-slate-500/40 pt-3" : ""}`}>
                    <p className="font-sans text-sm text-sky-200">
                        {outcome.hits} {outcome.hits === 1 ? "golpe" : "golpes"} · 
                    </p>
                    <p className="text-sm text-slate-300">Chances: <span className="text-emerald-200">{numberFormat.format(outcome.chance)}%</span></p>
                    <p className="text-sm">Daño por golpe: <DamageAmount value={formatRange(outcome.perHit)} damageType={damageType} /></p>
                    <p className="text-sm">Daño total: <DamageAmount value={formatRange(outcome.total)} damageType={damageType} /></p>
                    <p className="text-sm">Daño potencial total con crítico: <DamageAmount
                        value={criticalOutcomes?.[index] ? `${numberFormat.format(criticalOutcomes[index].total.min)} – ${numberFormat.format(criticalOutcomes[index].total.max)}` : "No disponible"}
                        damageType={damageType}
                    /></p>
                </div>
            ))}
        </div>
    );
};

export const MultiHitSection = ({ skill, criticalDamageMultiplier }: MultiHitSectionProps) => {
    switch (skill.hitModifiers?.type) {
        case "chance_multi_hit":
            return (
                <div className="space-y-3">
                    <ChanceMultiHitDetails skill={skill} criticalDamageMultiplier={criticalDamageMultiplier} />
                </div>
            );
        case "weighted_hit_count":
            return <HitDamageOutcomes skill={skill} criticalDamageMultiplier={criticalDamageMultiplier} />;
        default:
            return null;
    }
};
