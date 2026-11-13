import { bonusFullNameByRef, type SkillAura } from "netim2-shared";
import { SkillNextValue } from "../SkillNextValue";
import { useNextSkill } from "../../skill-upgrade-preview.context";
import { AuraModifierScalingTooltip } from "./AuraModifierScalingTooltip";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export const AuraEffectSection = ({ skill }: { skill: SkillAura }) => {
    const next = useNextSkill();
    const modifiers = [...skill.statsModifiers];
    if (next?.type === "aura") for (const modifier of next.statsModifiers) {
        if (!modifiers.some(item => item.target === modifier.target && item.operation === modifier.operation)) modifiers.push({ ...modifier, value: 0 });
    }
    return (
    <section className="space-y-3 text-sm">
        <h4 className="font-metin text-base text-amber-300">Efecto</h4>
        {modifiers.length === 0 ? (
            <p className="text-slate-300">Esta aura no tiene modificadores de estadísticas disponibles.</p>
        ) : (
            <div className="space-y-2">
                {modifiers.map((modifier, index) => {
                    const value = modifier.operation === "reduced" ? -modifier.value : modifier.value;
                    return (
                        <p key={index} className="text-slate-300">
                            {bonusFullNameByRef(modifier.bonusRefKey)}: <span className="text-emerald-200">{value > 0 ? "+" : ""}{numberFormat.format(value)}</span>{modifier.operation === "flat" ? " puntos" : "%"}
                            <SkillNextValue select={skill => {
                                const item = skill.type === "aura" ? skill.statsModifiers.find(item => item.target === modifier.target && item.operation === modifier.operation) : undefined;
                                return (item?.value ?? 0) * (modifier.operation === "reduced" ? -1 : 1);
                            }} />
                            <span className="ml-2 inline-block"><AuraModifierScalingTooltip scaling={skill.escalado} modifier={modifier} /></span>
                        </p>
                    );
                })}
            </div>
        )}
    </section>
    );
};
