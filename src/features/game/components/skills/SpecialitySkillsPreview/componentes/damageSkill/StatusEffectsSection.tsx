import type { BonusRefKeys, SkillDamage } from "netim2-shared";
import { useCharacterSession } from "../../../../../../characterSession/hooks/useCharacterSession";
import { COMBAT_COLORS } from "../../../../../../../shared/colors/combat-colors";
import { getStatusEffectIcons } from "../../../../../../../shared/icons/status-effect-icons";
import { getStatusEffectBaseDamage } from "../../../utils/get-status-effect-base-damage";
import { SkillNextValue } from "../SkillNextValue";
import { useNextSkill } from "../../skill-upgrade-preview.context";

const STATUS_EFFECT_NAMES = {
    veneno: "Veneno", incendio: "Incendio", electrico: "Eléctrico",
    sangrado: "Sangrado", retardo: "Retardo", desmayo: "Desmayo",
} as const;

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

const SLOW_STAT_NAMES: Partial<Record<BonusRefKeys, string>> = {
    vm: "Velocidad de movimiento",
    va: "Velocidad de ataque",
    vh: "Velocidad de hechizo",
};

export const StatusEffectsSection = ({ skill }: { skill: SkillDamage }) => {
    const { gameConfig } = useCharacterSession();
    const next = useNextSkill();
    const effects = { ...(next?.type === "damage" ? next.statusEffects : {}), ...skill.statusEffects };
    const bleedingConfig = gameConfig?.combat.statusEffect?.sangrado;
    const stunConfig = gameConfig?.combat.statusEffect?.desmayo;
    const slowConfig = gameConfig?.combat.statusEffect?.retardo;
    const poisonConfig = gameConfig?.combat.statusEffect?.veneno;
    const fireConfig = gameConfig?.combat.statusEffect?.incendio;
    const electricConfig = gameConfig?.combat.statusEffect?.electrico;
    const electricEffect = electricConfig?.type === "periodic_damage" && electricConfig.effectId === "electrico"
        ? electricConfig : null;
    const electricDamage = electricEffect
        ? getStatusEffectBaseDamage(skill, electricEffect.baseDamageRatio)
        : null;
    const fireDamage = fireConfig?.type === "periodic_damage" && fireConfig.effectId === "incendio"
        ? getStatusEffectBaseDamage(skill, fireConfig.baseDamageRatio)
        : null;
    const fireRefreshBonus = fireConfig?.type === "periodic_damage" && fireConfig.effectId === "incendio"
        ? fireConfig.extraDamageRatioPerRefresh * 100
        : null;
    const poisonDamage = poisonConfig?.type === "periodic_damage" && poisonConfig.effectId === "veneno"
        ? getStatusEffectBaseDamage(skill, poisonConfig.baseDamageRatio)
        : null;
    const poisonHealingReduction = poisonConfig?.type === "periodic_damage" && poisonConfig.effectId === "veneno"
        ? poisonConfig.healReduction * 100
        : null;
    const bleedingDamage = bleedingConfig?.type === "periodic_damage" && bleedingConfig.effectId === "sangrado"
        ? getStatusEffectBaseDamage(skill, bleedingConfig.baseDamageRatio)
        : null;

    return (
        <div className="space-y-2">
            {Object.keys(effects).length === 0 && (
                <p className="text-sm text-slate-300">No hay efectos de estado disponibles para este nivel.</p>
            )}
            {Object.keys(effects).map(effect => {
                const key = effect as keyof NonNullable<SkillDamage['statusEffects']>;
                const chance = skill.statusEffects?.[key] ?? 0;
                return (
                <div key={effect} className="space-y-2 text-sm">
                    {effect === "sangrado" && (
                        <>
                            <h4 className="font-metin text-base text-amber-300">Sangrado</h4>
                            <p className="text-slate-300">
                                Chances de ocasionar {STATUS_EFFECT_NAMES[effect as keyof typeof STATUS_EFFECT_NAMES]} por golpe: <span className="text-emerald-200">{numberFormat.format(chance)}%</span><SkillNextValue select={value => value.type === "damage" ? `${numberFormat.format(value.statusEffects?.[key] ?? 0)}%` : null} />
                            </p>
                            <p className="text-slate-300">Duración: {bleedingConfig ? (
                                <>
                                    <span className="text-emerald-200">{numberFormat.format(bleedingConfig.duration.baseTurns)}</span>
                                    {bleedingConfig.duration.baseTurns === 1 ? " turno" : " turnos"}
                                </>
                            ) : "-"}</p>
                            <p>Daño base por turno: <span className={`inline-flex items-center gap-1 align-middle ${COMBAT_COLORS.sangrado.text}`}>
                                {bleedingDamage ? `${numberFormat.format(bleedingDamage.min)} – ${numberFormat.format(bleedingDamage.max)}` : "No disponible"}
                                <span
                                    role="img"
                                    aria-label="Sangrado"
                                    className="h-4 w-4 shrink-0 bg-current"
                                    style={{
                                        maskImage: `url('${getStatusEffectIcons("sangrado").fight}')`,
                                        maskSize: "contain",
                                        maskPosition: "center",
                                        maskRepeat: "no-repeat",
                                    }}
                                />
                                <SkillNextValue select={value => {
                                    if (value.type !== "damage" || bleedingConfig?.type !== "periodic_damage") return null;
                                    const damage = getStatusEffectBaseDamage(value, bleedingConfig.baseDamageRatio);
                                    return `${numberFormat.format(damage.min)} – ${numberFormat.format(damage.max)}`;
                                }} />
                            </span></p>
                            <p className="text-xs text-slate-400">Sin crítico, bonificaciones ni escalados del objetivo.</p>
                        </>
                    )}
                    {effect === "desmayo" && (
                        <>
                            <h4 className="font-metin text-base text-amber-300">Desmayo</h4>
                            <p className="text-slate-300">
                                Chances de ocasionar Desmayo por golpe: <span className="text-emerald-200">{numberFormat.format(chance)}%</span><SkillNextValue select={value => value.type === "damage" ? `${numberFormat.format(value.statusEffects?.[key] ?? 0)}%` : null} />
                            </p>
                            <p className="text-slate-300">Duración del efecto: {stunConfig ? (
                                <>
                                    <span className="text-emerald-200">{numberFormat.format(stunConfig.duration.baseTurns)}</span>
                                    {stunConfig.duration.baseTurns === 1 ? " turno" : " turnos"}
                                </>
                            ) : "-"}</p>
                        </>
                    )}
                    {effect === "retardo" && (
                        <>
                            <h4 className="font-metin text-base text-amber-300">Retardo</h4>
                            <p className="text-slate-300">
                                Chances de ocasionar Retardo por golpe: <span className="text-emerald-200">{numberFormat.format(chance)}%</span><SkillNextValue select={value => value.type === "damage" ? `${numberFormat.format(value.statusEffects?.[key] ?? 0)}%` : null} />
                            </p>
                            <p className="text-slate-300">Duración del efecto: {slowConfig ? (
                                <>
                                    <span className="text-emerald-200">{numberFormat.format(slowConfig.duration.baseTurns)}</span>
                                    {slowConfig.duration.baseTurns === 1 ? " turno" : " turnos"}
                                </>
                            ) : "-"}</p>
                            {slowConfig?.statsModifiers && (
                                <div className="space-y-2 text-slate-300">
                                    <p className="text-cyan-200">Estadísticas afectadas:</p>
                                    {slowConfig.statsModifiers.map((modifier, index) => {
                                        const value = modifier.operation === "reduced" ? -modifier.value : modifier.value;
                                        return (
                                            <p key={index}>
                                                {SLOW_STAT_NAMES[modifier.bonusRefKey] ?? modifier.bonusRefKey}: <span className="text-emerald-200">{value > 0 ? "+" : ""}{numberFormat.format(value)}</span>{modifier.operation === "flat" ? " puntos" : "%"}
                                            </p>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                    {effect === "incendio" && (
                        <>
                            <h4 className="font-metin text-base text-amber-300">Incendio</h4>
                            <p className="text-slate-300">
                                Chances de ocasionar Incendio por golpe: <span className="text-emerald-200">{numberFormat.format(chance)}%</span><SkillNextValue select={value => value.type === "damage" ? `${numberFormat.format(value.statusEffects?.[key] ?? 0)}%` : null} />
                            </p>
                            <p className="text-slate-300">Duración del efecto: {fireConfig ? (
                                <>
                                    <span className="text-emerald-200">{numberFormat.format(fireConfig.duration.baseTurns)}</span>
                                    {fireConfig.duration.baseTurns === 1 ? " turno" : " turnos"}
                                </>
                            ) : "-"}</p>
                            <p>Daño base por turno: <span className={`inline-flex items-center gap-1 align-middle ${COMBAT_COLORS.incendio.text}`}>
                                {fireDamage ? `${numberFormat.format(fireDamage.min)} – ${numberFormat.format(fireDamage.max)}` : "No disponible"}
                                <span
                                    role="img"
                                    aria-label="Incendio"
                                    className="h-4 w-4 shrink-0 bg-current"
                                    style={{
                                        maskImage: `url('${getStatusEffectIcons("incendio").fight}')`,
                                        maskSize: "contain",
                                        maskPosition: "center",
                                        maskRepeat: "no-repeat",
                                    }}
                                />
                                <SkillNextValue select={value => {
                                    if (value.type !== "damage" || fireConfig?.type !== "periodic_damage") return null;
                                    const damage = getStatusEffectBaseDamage(value, fireConfig.baseDamageRatio);
                                    return `${numberFormat.format(damage.min)} – ${numberFormat.format(damage.max)}`;
                                }} />
                            </span></p>
                            {fireRefreshBonus !== null && (
                                <p className="text-slate-300">
                                    Al reaplicar Incendio, su daño por turno aumenta un <span className="text-emerald-200">{numberFormat.format(fireRefreshBonus)}%</span>.
                                </p>
                            )}
                        </>
                    )}
                    {effect === "electrico" && (
                        <>
                            <h4 className="font-metin text-base text-amber-300">Eléctrico</h4>
                            <p className="text-slate-300">
                                Chances de ocasionar Eléctrico por golpe: <span className="text-emerald-200">{numberFormat.format(chance)}%</span><SkillNextValue select={value => value.type === "damage" ? `${numberFormat.format(value.statusEffects?.[key] ?? 0)}%` : null} />
                            </p>
                            <p className="text-slate-300">Duración del efecto: {electricConfig ? (
                                <>
                                    <span className="text-emerald-200">{numberFormat.format(electricConfig.duration.baseTurns)}</span>
                                    {electricConfig.duration.baseTurns === 1 ? " turno" : " turnos"}
                                </>
                            ) : "-"}</p>
                            <p>Daño base por turno: <span className={`inline-flex items-center gap-1 align-middle ${COMBAT_COLORS.electrico.text}`}>
                                {electricDamage ? `${numberFormat.format(electricDamage.min)} – ${numberFormat.format(electricDamage.max)}` : "No disponible"}
                                <span
                                    role="img"
                                    aria-label="Eléctrico"
                                    className="h-4 w-4 shrink-0 bg-current"
                                    style={{
                                        maskImage: `url('${getStatusEffectIcons("electrico").fight}')`,
                                        maskSize: "contain",
                                        maskPosition: "center",
                                        maskRepeat: "no-repeat",
                                    }}
                                />
                                <SkillNextValue select={value => {
                                    if (value.type !== "damage" || electricConfig?.type !== "periodic_damage") return null;
                                    const damage = getStatusEffectBaseDamage(value, electricConfig.baseDamageRatio);
                                    return `${numberFormat.format(damage.min)} – ${numberFormat.format(damage.max)}`;
                                }} />
                            </span></p>
                            {electricEffect?.stacks && (
                                <>
                                    <h4 className="text-cyan-200">Descarga</h4>
                                    <p className="text-slate-300">
                                        Acumulaciones para activar descarga: <span className="text-emerald-200">{numberFormat.format(electricEffect.stacks.max)}</span>
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Cada ataque básico o habilidad que aplica el efecto Eléctrico añade una acumulación al objetivo.
                                    </p>
                                    <p className="text-slate-300">
                                        Al alcanzar <span className="text-emerald-200">{numberFormat.format(electricEffect.stacks.toApplyExtraDamage)}</span> acumulaciones,
                                        genera una descarga que causa daño adicional equivalente al <span className="text-emerald-200">{numberFormat.format(electricEffect.extraDamageRatioPerStackThreshold * 100)}%</span> del daño por turno.
                                    </p>

                                </>
                            )}
                        </>
                    )}
                    {effect === "veneno" && (
                        <>
                            <h4 className="font-metin text-base text-amber-300">Veneno</h4>
                            <p className="text-slate-300">
                                Chances de ocasionar Veneno por golpe: <span className="text-emerald-200">{numberFormat.format(chance)}%</span><SkillNextValue select={value => value.type === "damage" ? `${numberFormat.format(value.statusEffects?.[key] ?? 0)}%` : null} />
                            </p>
                            <p className="text-slate-300">Duración del efecto: {poisonConfig ? (
                                <>
                                    <span className="text-emerald-200">{numberFormat.format(poisonConfig.duration.baseTurns)}</span>
                                    {poisonConfig.duration.baseTurns === 1 ? " turno" : " turnos"}
                                </>
                            ) : "-"}</p>
                            <p>Daño base por turno: <span className={`inline-flex items-center gap-1 align-middle ${COMBAT_COLORS.veneno.text}`}>
                                {poisonDamage ? `${numberFormat.format(poisonDamage.min)} – ${numberFormat.format(poisonDamage.max)}` : "No disponible"}
                                <span
                                    role="img"
                                    aria-label="Veneno"
                                    className="h-4 w-4 shrink-0 bg-current"
                                    style={{
                                        maskImage: `url('${getStatusEffectIcons("veneno").fight}')`,
                                        maskSize: "contain",
                                        maskPosition: "center",
                                        maskRepeat: "no-repeat",
                                    }}
                                />
                                <SkillNextValue select={value => {
                                    if (value.type !== "damage" || poisonConfig?.type !== "periodic_damage") return null;
                                    const damage = getStatusEffectBaseDamage(value, poisonConfig.baseDamageRatio);
                                    return `${numberFormat.format(damage.min)} – ${numberFormat.format(damage.max)}`;
                                }} />
                            </span></p>
                            {poisonHealingReduction !== null && (
                                <p className="text-slate-300">
                                    <span className="text-cyan-200">Corta curas:</span> reduce las curaciónes recibidas por el objetivo un <span className="text-emerald-200">{numberFormat.format(poisonHealingReduction)}%</span> mientras esté envenenado.
                                </p>
                            )}
                        </>
                    )}
                </div>
            ); })}
        </div>
    );
};
