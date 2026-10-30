import type { SkillDamage } from "netim2-shared";
import { WeightedMultiplierDetails } from "./WeightedMultiplierDetails";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export const AmplifiersSection = ({ skill, criticalDamageMultiplier }: { skill: SkillDamage; criticalDamageMultiplier: number | null }) => {
    const modifier = skill.damageModifiers;

    return (
        <section className="space-y-2 text-sm">
            <h4 className="font-metin text-base text-amber-300">Amplificadores</h4>
            {!modifier && <p className="text-slate-300">No hay datos disponibles para este nivel.</p>}
            {modifier?.type === "chance_multiplier" && (
                <>
                    {modifier.description && <p className="text-slate-300">{modifier.description}</p>}
                    <p className="text-slate-300">Probabilidad de amplificar el daño: <span className="text-emerald-200">{numberFormat.format(modifier.chance)}%</span></p>
                    <p className="text-slate-300">Multiplicador de daño: <span className="text-emerald-200">×{numberFormat.format(modifier.multiplier)}</span></p>
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
                    <p className="text-slate-300">Multiplicador de daño: <span className="text-emerald-200">×{numberFormat.format(modifier.multiplier)}</span></p>
                </>
            )}
        </section>
    );
};
