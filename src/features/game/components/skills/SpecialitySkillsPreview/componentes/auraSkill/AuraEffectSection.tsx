import { bonusFullNameByRef, type SkillAura } from "netim2-shared";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export const AuraEffectSection = ({ skill }: { skill: SkillAura }) => (
    <section className="space-y-3 text-sm">
        <h4 className="font-metin text-base text-amber-300">Efecto</h4>
        {skill.statsModifiers.length === 0 ? (
            <p className="text-slate-300">Esta aura no tiene modificadores de estadísticas disponibles.</p>
        ) : (
            <div className="space-y-2">
                {skill.statsModifiers.map((modifier, index) => {
                    const value = modifier.operation === "reduced" ? -modifier.value : modifier.value;
                    return (
                        <p key={index} className="text-slate-300">
                            {bonusFullNameByRef(modifier.bonusRefKey)}: <span className="text-emerald-200">{value > 0 ? "+" : ""}{numberFormat.format(value)}</span>{modifier.operation === "flat" ? " puntos" : "%"}
                        </p>
                    );
                })}
            </div>
        )}
    </section>
);
