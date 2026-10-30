import type { SkillAura } from "netim2-shared";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

const ManaAmount = ({ value }: { value: number }) => (
    <span className="inline-flex items-center gap-1 align-middle text-cyan-500">
        {numberFormat.format(value)}
        <span role="img" aria-label="Maná" className="h-4 w-4 shrink-0 bg-current" style={{ mask: "url('/fight/mana-icon1.png') center / contain no-repeat" }} />
    </span>
);

export const AuraGeneralSection = ({ skill }: { skill: SkillAura }) => (
    <section className="space-y-3 text-sm">
        <h4 className="font-metin text-base text-amber-300">General</h4>
        {skill.mana.type === "upkeep" ? (
            <>
                <p>Costo de maná al activar: <ManaAmount value={skill.mana.initialAmount ?? 0} /></p>
                <p>Costo de maná por turno: <ManaAmount value={skill.mana.amountPerTurn} /></p>
            </>
        ) : (
            <p>Costo de maná al activar: {skill.mana.type === "none" ? "Sin coste" : <ManaAmount value={skill.mana.amount} />}</p>
        )}
        <p>Duración: {skill.duration?.type === "turns" ? (
            <><span className="text-emerald-200">{numberFormat.format(skill.duration.turns)}</span>{skill.duration.turns === 1 ? " turno" : " turnos"}</>
        ) : skill.duration?.type === "until_no_mana" ? "Hasta agotar el maná" : "Sin duración definida"}</p>
        {skill.cd.onActivate === undefined && skill.cd.onDeactivate === undefined ? (
            <p>Enfriamiento: Sin enfriamiento</p>
        ) : (
            <div className="space-y-2">
                {[
                    { value: skill.cd.onActivate, label: "Enfriamiento al usar la habilidad" },
                    { value: skill.cd.onDeactivate, label: "Enfriamiento al desactivar la habilidad" },
                ].map(({ value, label }) => value !== undefined && (
                    <p key={label}>{label}: <span className="inline-flex items-center gap-1 align-middle">
                        <span className="text-emerald-200">{numberFormat.format(value)}</span>
                        <img src="/game/cdr.png" alt="Enfriamiento" className="h-4 w-4 object-contain" />
                    </span>{value === 1 ? " turno" : " turnos"}</p>
                ))}
            </div>
        )}
    </section>
);
