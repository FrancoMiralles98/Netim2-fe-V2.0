import type { ActiveStatusEffectId, CombatActionModifiers, CombatHitResult, CombatHitStatusEffect } from "netim2-shared";
import type { FightFighterState } from "../card/fighter-state";
import type { HitVisual } from "./animations.types";
import { COMBAT_COLORS } from "../../../shared/colors/combat-colors";

type VisualContent = Omit<Extract<HitVisual, { type: "value" }>, "id" | "expiresAt" | "lane">
    | Omit<Extract<HitVisual, { type: "notice" }>, "id" | "expiresAt" | "lane">;

const statusNotices: Record<ActiveStatusEffectId, { text: string; colorClass: string }> = {
    veneno: { text: "Envenenado", colorClass: COMBAT_COLORS.veneno.text },
    sangrado: { text: "Sangrando", colorClass: COMBAT_COLORS.sangrado.text },
    incendio: { text: "Incendiado", colorClass: COMBAT_COLORS.incendio.text },
    electrico: { text: "Electrocutado", colorClass: COMBAT_COLORS.electrico.text },
    desmayo: { text: "Desmayado", colorClass: "text-violet-300" },
    retardo: { text: "Ralentizado", colorClass: "text-violet-300" },
    corta_curacion: { text: "Curación reducida", colorClass: "text-rose-300" },
};

export const applyCombatHit = (fighters: FightFighterState[], hit: CombatHitResult): FightFighterState[] =>
    fighters.map(fighter => {
        if (fighter.fighterId !== hit.attackerId && fighter.fighterId !== hit.targetId) return fighter;
        const isAttacker = fighter.fighterId === hit.attackerId;
        return {
            ...fighter,
            alive: !(isAttacker ? hit.attackerDefeated : hit.targetDefeated),
            resources: {
                ...fighter.resources,
                hp: { ...fighter.resources.hp, current: isAttacker ? hit.attackerHpAfter : hit.targetHpAfter },
            },
        };
    });

export const applyHitStatus = (fighters: FightFighterState[], hit: CombatHitResult, effect: CombatHitStatusEffect): FightFighterState[] =>
    fighters.map(fighter => {
        if (fighter.fighterId !== hit.targetId || effect.resisted || !effect.after) return fighter;
        const activeEffects = new Map(fighter.activeEffects);
        activeEffects.set(effect.effectId, {
            effectId: effect.effectId,
            sourceFighterId: effect.after.sourceFighterId,
            remainingTurns: effect.after.remainingTurns ?? 0,
            damage: effect.after.damagePerTick,
            stacks: effect.after.stacks,
        });
        return { ...fighter, activeEffects };
    });

export const getHitVisuals = (hit: CombatHitResult, createId: () => string): VisualContent[] => {
    if (hit.outcome !== "hit") {
        const labels = { missed: "Fallado", dodged: "Esquivado", blocked: "Bloqueado" };
        return [{ type: "notice", fighterId: hit.targetId, text: labels[hit.outcome], colorClass: "text-slate-200" }];
    }
    const visuals: VisualContent[] = hit.components.filter(component => component.appliedDamage > 0).map(component => ({
        type: "value",
        fighterId: hit.targetId,
        animation: {
            type: "damage", id: createId(), targetId: hit.targetId,
            amount: component.appliedDamage, damageType: component.damageType,
            critical: hit.critical, penetrating: hit.penetrating,
        },
    }));
    for (const effect of hit.statusEffects) {
        if (effect.stackProc && effect.stackProc.appliedDamage > 0) {
            visuals.push({
                type: "value", fighterId: hit.targetId,
                animation: { type: "status_effect_damage", id: createId(), targetId: hit.targetId, effectId: effect.effectId, amount: effect.stackProc.appliedDamage },
            });
        }
    }
    if (hit.healing.effectiveHealing > 0) {
        visuals.push({
            type: "value", fighterId: hit.attackerId,
            animation: { type: "healing", id: createId(), targetId: hit.attackerId, amount: hit.healing.effectiveHealing, critical: false },
        });
    }
    if (hit.reflectedDamage > 0) {
        visuals.push({
            type: "value", fighterId: hit.attackerId,
            animation: { type: "damage", id: createId(), targetId: hit.attackerId, amount: hit.reflectedDamage, damageType: "true", critical: false, penetrating: false, reflected: true },
        });
    }
    if (hit.statusEffects.length === 1) {
        const notice = getHitStatusNotice(hit, hit.statusEffects[0]);
        const damage = visuals.find(visual => visual.type === "value" && visual.animation.type === "damage" && visual.fighterId === hit.targetId);
        if (damage?.type === "value" && damage.animation.type === "damage") {
            damage.animation.statusNotice = { text: notice.text, colorClass: notice.colorClass };
        } else {
            visuals.push(notice);
        }
    }
    return visuals;
};

export const getHitStatusNotice = (hit: CombatHitResult, effect: CombatHitStatusEffect): Extract<VisualContent, { type: "notice" }> => {
    const notice = statusNotices[effect.effectId];
    let text = notice.text;
    if (effect.resisted) text = `Resistió ${effect.effectId.replaceAll("_", " ")}`;
    else if (effect.changes.includes("stack_triggered")) text = `${notice.text} · descarga`;
    else if (effect.changes.includes("stack_added")) text = `${notice.text} · acumulación`;
    else if (!effect.applied && effect.before) text = `${notice.text} · actualizado`;
    return { type: "notice", fighterId: hit.targetId, colorClass: notice.colorClass, text };
};

export const getModifierNotice = (modifiers: CombatActionModifiers): string => {
    const messages = [];
    if (modifiers.plannedHitCount > 1) messages.push(`${modifiers.plannedHitCount} golpes`);
    if (modifiers.damageMultiplierPerHit !== 1) messages.push(`Daño por golpe ×${modifiers.damageMultiplierPerHit}`);
    if (modifiers.damageModifierApplied) messages.push(modifiers.damageModifierDescription || `Amplificación ×${modifiers.skillDamageMultiplier ?? 1}`);
    if (modifiers.buffDamageMultiplier !== undefined && modifiers.buffDamageMultiplier !== 1) messages.push(`Buff ×${modifiers.buffDamageMultiplier}`);
    if (modifiers.contextualDamageMultiplier !== undefined && modifiers.contextualDamageMultiplier !== 1) messages.push(`Bonus ×${modifiers.contextualDamageMultiplier}`);
    return messages.join(" · ");
};
