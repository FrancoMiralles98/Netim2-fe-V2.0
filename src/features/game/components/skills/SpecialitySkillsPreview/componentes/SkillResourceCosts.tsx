import type { SkillType } from "netim2-shared";
import { useNextSkill } from "../skill-upgrade-preview.context";
import { NextValue } from "./SkillNextValue";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
const initialMana = (skill: SkillType) => skill.mana.type === "none" ? 0
    : skill.mana.type === "instant" ? skill.mana.amount : skill.mana.initialAmount ?? 0;
const upkeepMana = (skill: SkillType) => skill.mana.type === "upkeep" ? skill.mana.amountPerTurn : 0;
const duration = (skill: SkillType) => "duration" in skill && skill.duration
    ? skill.duration.type === "turns" ? `${skill.duration.turns} turnos` : "Hasta agotar el maná" : "Sin duración definida";

export const SkillResourceCosts = ({ skill, showDuration = false }: { skill: SkillType; showDuration?: boolean }) => {
    const next = useNextSkill();
    return <div className="space-y-3 text-sm">
        <p>Costo de maná al activar: <span className="inline-flex items-center gap-1 align-middle text-cyan-500">
            {numberFormat.format(initialMana(skill))}
            <span role="img" aria-label="Maná" className="h-4 w-4 shrink-0 bg-current" style={{ mask: "url('/fight/mana-icon1.png') center / contain no-repeat" }} />
        </span><NextValue current={initialMana(skill)} next={next ? initialMana(next) : null} /></p>
        {(skill.mana.type === "upkeep" || next?.mana.type === "upkeep") && <p>Costo de maná por turno: <span className="text-cyan-500">{numberFormat.format(upkeepMana(skill))}</span><NextValue current={upkeepMana(skill)} next={next ? upkeepMana(next) : null} /></p>}
        {showDuration && <p>Duración: <span className="text-emerald-200">{duration(skill)}</span><NextValue current={duration(skill)} next={next ? duration(next) : null} /></p>}
        {(["onActivate", "onDeactivate"] as const).map(event => (skill.cd[event] !== undefined || next?.cd[event] !== undefined) && <p key={event}>
            {event === "onActivate" ? "Enfriamiento al usar" : "Enfriamiento al desactivar"}: <span className="inline-flex items-center gap-1 align-middle">
                <span className="text-emerald-200">{numberFormat.format(skill.cd[event] ?? 0)}</span><img src="/game/cdr.png" alt="Enfriamiento" className="h-4 w-4 object-contain" />
            </span> turnos<NextValue current={skill.cd[event] ?? 0} next={next ? next.cd[event] ?? 0 : null} />
        </p>)}
        {!Object.keys(skill.cd).length && !Object.keys(next?.cd ?? {}).length && <p>Enfriamiento: Sin enfriamiento</p>}
    </div>;
};
