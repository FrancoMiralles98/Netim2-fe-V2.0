import type { SkillDamage } from "netim2-shared";
import { COMBAT_COLORS } from "../../../../../../../shared/colors/combat-colors";
import { getSkillHitDamage } from "../../../utils/get-skill-hit-damage";
import { DamageAmount } from "./DamageAmount";
import { SkillNextValue, NextValue } from "../SkillNextValue";
import { useNextSkill } from "../../skill-upgrade-preview.context";

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
    const totalDamage = {
        min: Math.floor(skill.components.range.min * multiplier) * hits,
        max: Math.floor(skill.components.range.max * multiplier) * hits,
    };
    const criticalTotal = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier)
        ? {
            min: Math.floor(skill.components.range.min * multiplier * criticalDamageMultiplier) * hits,
            max: Math.floor(skill.components.range.max * multiplier * criticalDamageMultiplier) * hits,
        } : null;
    const damageType = skill.components.damageType;

    return (
        <section className="space-y-2">
            <h4 className="font-metin text-base text-amber-300">Multi Golpe</h4>
            <dl className="space-y-2 font-sans text-sm text-slate-300">
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt>Chances de ocasionar multi golpes:</dt>
                    <dd className="text-emerald-200">{numberFormat.format(chance)}%<SkillNextValue select={value => value.type === "damage" && value.hitModifiers?.type === "chance_multi_hit" ? `${numberFormat.format(value.hitModifiers.chance)}%` : null} /></dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt>Cantidad de golpes a efectuar:</dt>
                    <dd className="text-emerald-200">{hits}<SkillNextValue select={value => value.type === "damage" && value.hitModifiers?.type === "chance_multi_hit" ? value.hitModifiers.hits : null} /></dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt>% Daño Base por golpe:</dt>
                    <dd className={damageType ? COMBAT_COLORS[damageType].text : ""}>{numberFormat.format(multiplier * 100)}%<SkillNextValue select={value => value.type === "damage" && value.hitModifiers?.type === "chance_multi_hit" ? `${numberFormat.format(value.hitModifiers.damageMultiplierPerHit * 100)}%` : null} /></dd>
                </div>
            </dl>
            <p className="text-sm">Daño potencial total: <DamageAmount value={formatRange(totalDamage)} damageType={damageType} /><SkillNextValue select={value => value.type === "damage" ? formatChanceTotal(value) : null} /></p>
            <p className="text-sm">Daño potencial total con crítico: <DamageAmount
                value={criticalTotal ? `${numberFormat.format(criticalTotal.min)} – ${numberFormat.format(criticalTotal.max)}` : "No disponible"}
                damageType={damageType}
            /><SkillNextValue select={value => value.type === "damage" && criticalDamageMultiplier !== null ? formatChanceTotal(value, criticalDamageMultiplier) : null} /></p>
        </section>
    );
};

const HitDamageOutcomes = ({ skill, criticalDamageMultiplier }: MultiHitSectionProps) => {
    const preview = useNextSkill();
    const next = preview?.type === "damage" ? preview : null;
    const nextOutcomes = next ? getSkillHitDamage(next) : [];
    const nextCritical = next && criticalDamageMultiplier !== null ? getSkillHitDamage(next, criticalDamageMultiplier) : [];
    const outcomes = getSkillHitDamage(skill);
    const criticalOutcomes = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier)
        ? getSkillHitDamage(skill, criticalDamageMultiplier) : null;
    const damageType = skill.components.damageType;

    return (
        <div className="space-y-2">
            <h4 className="font-metin text-base text-amber-300">Multi Golpe</h4>
            {outcomes.map((outcome, index) => (
                <div key={index} className={`space-y-2 ${index > 0 ? "border-t border-slate-500/40 pt-3" : ""}`}>
                    <p className="font-sans text-sm text-sky-200">
                        {outcome.hits} {outcome.hits === 1 ? "golpe" : "golpes"} · 
                    </p>
                    <p className="text-sm text-slate-300">Chances: <span className="text-emerald-200">{numberFormat.format(outcome.chance)}%</span><NextValue current={`${numberFormat.format(outcome.chance)}%`} next={nextOutcomes[index] ? `${numberFormat.format(nextOutcomes[index].chance)}%` : null} /></p>
                    <p className="text-sm">Daño por golpe: <DamageAmount value={formatRange(outcome.perHit)} damageType={damageType} /><NextValue current={formatRange(outcome.perHit)} next={nextOutcomes[index] ? formatRange(nextOutcomes[index].perHit) : null} /></p>
                    <p className="text-sm">Daño total: <DamageAmount value={formatRange(outcome.total)} damageType={damageType} /><NextValue current={formatRange(outcome.total)} next={nextOutcomes[index] ? formatRange(nextOutcomes[index].total) : null} /></p>
                    <p className="text-sm">Daño potencial total con crítico: <DamageAmount
                        value={criticalOutcomes?.[index] ? `${numberFormat.format(criticalOutcomes[index].total.min)} – ${numberFormat.format(criticalOutcomes[index].total.max)}` : "No disponible"}
                        damageType={damageType}
                    /><NextValue current={criticalOutcomes?.[index] ? formatRange(criticalOutcomes[index].total) : null} next={nextCritical[index] ? formatRange(nextCritical[index].total) : null} /></p>
                </div>
            ))}
        </div>
    );
};

export const MultiHitSection = ({ skill, criticalDamageMultiplier }: MultiHitSectionProps) => {
    const next = useNextSkill();
    if (!skill.hitModifiers && next?.type === "damage" && next.hitModifiers) return <div className="space-y-2 text-sm text-green-400"><p>→ Multi golpes disponible en el siguiente nivel.</p><p>{next.hitModifiers.type === "chance_multi_hit" ? `${next.hitModifiers.chance}% · ${next.hitModifiers.hits} golpes · ${next.hitModifiers.damageMultiplierPerHit * 100}% de daño por golpe` : "Nuevos resultados de multi golpes disponibles."}</p></div>;
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

function formatChanceTotal(skill: SkillDamage, critical = 1): string | null {
    const modifier = skill.hitModifiers;
    if (modifier?.type !== "chance_multi_hit") return null;
    return formatRange({
        min: Math.floor(skill.components.range.min * modifier.damageMultiplierPerHit * critical) * modifier.hits,
        max: Math.floor(skill.components.range.max * modifier.damageMultiplierPerHit * critical) * modifier.hits,
    });
}
