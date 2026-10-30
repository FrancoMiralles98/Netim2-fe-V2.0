import type { SkillDamage } from "netim2-shared";
import { DamageAmount } from "./DamageAmount";

interface BaseDamageSectionProps {
    skill: SkillDamage;
    criticalDamageMultiplier: number | null;
}

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

const ManaAmount = ({ value }: { value: number }) => (
    <span className="inline-flex items-center gap-1 align-middle text-cyan-500">
        {numberFormat.format(value)}
        <span
            role="img"
            aria-label="Maná"
            className="h-4 w-4 shrink-0 bg-current"
            style={{ mask: "url('/fight/mana-icon1.png') center / contain no-repeat" }}
        />
    </span>
);

export const BaseDamageSection = ({ skill, criticalDamageMultiplier }: BaseDamageSectionProps) => {
    const damageType = skill.components.every((component) => component.damageType === skill.components[0]?.damageType)
        ? skill.components[0]?.damageType : undefined;
    const baseDamage = skill.components.reduce((total, component) => ({
        min: total.min + component.range.min,
        max: total.max + component.range.max,
    }), { min: 0, max: 0 });

    const criticalDamage = typeof criticalDamageMultiplier === "number" && Number.isFinite(criticalDamageMultiplier)
        ? skill.components.reduce((total, component) => ({
            min: total.min + Math.floor(component.range.min * criticalDamageMultiplier),
            max: total.max + Math.floor(component.range.max * criticalDamageMultiplier),
        }), { min: 0, max: 0 }) : null;

    return (
        <div className="space-y-3 text-sm">
            <h4 className="font-metin text-base text-amber-300">Base</h4>
            <p>Daño base: <DamageAmount
                value={`${numberFormat.format(baseDamage.min)} – ${numberFormat.format(baseDamage.max)}`}
                damageType={damageType}
            /></p>
            <p>Daño base con crítico: <DamageAmount
                value={criticalDamage ? `${numberFormat.format(criticalDamage.min)} – ${numberFormat.format(criticalDamage.max)}` : "No disponible"}
                damageType={damageType}
            /></p>
            <p>Coste de maná: {skill.mana.type === "none" ? "Sin coste" : skill.mana.type === "instant" ? (
                <ManaAmount value={skill.mana.amount} />
            ) : (
                <>
                    <ManaAmount value={skill.mana.initialAmount ?? 0} /> iniciales · <ManaAmount value={skill.mana.amountPerTurn} /> por turno
                </>
            )}</p>
            {skill.cd.onActivate === undefined && skill.cd.onDeactivate === undefined ? (
                <p>Enfriamiento: Sin enfriamiento</p>
            ) : (
                <div className="space-y-2">
                    {[
                        { value: skill.cd.onActivate, label: "Enfriamiento al usar" },
                        { value: skill.cd.onDeactivate, label: "Enfriamiento al desactivar" },
                    ].map(({ value, label }) => value !== undefined && (
                        <p key={label}>{label}: <span className="inline-flex items-center gap-1 align-middle">
                            <span className="text-emerald-200">{numberFormat.format(value)}</span>
                            <img src="/game/cdr.png" alt="Enfriamiento" className="h-4 w-4 object-contain" />
                        </span>{value === 1 ? " turno" : " turnos"}</p>
                    ))}
                </div>
            )}
        </div>
    );
};
