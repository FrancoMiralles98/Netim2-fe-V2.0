import type { SkillDamage } from "netim2-shared";
import { WeightedMultiplierDetails } from "./WeightedMultiplierDetails";
import { SkillNextValue } from "../SkillNextValue";
import { useNextSkill } from "../../skill-upgrade-preview.context";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export const AmplifiersSection = ({ skill, criticalDamageMultiplier }: { skill: SkillDamage; criticalDamageMultiplier: number | null }) => {
    const modifier = skill.damageModifiers;
    const next = useNextSkill();

    return (
        <section className="space-y-2 text-sm">
            <h4 className="font-metin text-base text-amber-300">Amplificadores</h4>
            {!modifier && <p className="text-slate-300">No hay datos disponibles para este nivel.{next?.type === "damage" && next.damageModifiers && <span className="ml-2 text-green-400">→ Amplificación disponible en el siguiente nivel.</span>}</p>}
            {modifier?.type === "chance_multiplier" && (
                <>
                    {modifier.description && <p className="text-slate-300">{modifier.description}</p>}
                    <p className="text-slate-300">Probabilidad de amplificar el daño: <span className="text-emerald-200">{numberFormat.format(modifier.chance)}%</span><SkillNextValue select={value => value.type === "damage" && value.damageModifiers?.type === "chance_multiplier" ? `${numberFormat.format(value.damageModifiers.chance)}%` : null} /></p>
                    <p className="text-slate-300">Multiplicador de daño: <span className="text-emerald-200">×{numberFormat.format(modifier.multiplier)}</span><SkillNextValue select={value => value.type === "damage" && value.damageModifiers && value.damageModifiers.type !== "weighted_multiplier" ? `×${numberFormat.format(value.damageModifiers.multiplier)}` : null} /></p>
                </>
            )}
            {modifier?.type === "weighted_multiplier" && (
                <WeightedMultiplierDetails skill={skill} modifier={modifier} criticalDamageMultiplier={criticalDamageMultiplier} />
            )}
            {modifier?.type === "conditional_multiplier" && (
                <>
                    <p className="text-slate-300">
                        {modifier.description ?? `Se activa si ${modifier.condition.type === "target_has_effect" ? "el objetivo" : "el personaje"} tiene el efecto ${modifier.condition.effectId}.`}
                    </p>
                    <p className="text-slate-300">Multiplicador de daño: <span className="text-emerald-200">×{numberFormat.format(modifier.multiplier)}</span><SkillNextValue select={value => value.type === "damage" && value.damageModifiers && value.damageModifiers.type !== "weighted_multiplier" ? `×${numberFormat.format(value.damageModifiers.multiplier)}` : null} /></p>
                </>
            )}
        </section>
    );
};
