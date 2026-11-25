import type { CombatAttackPlayback, CombatHitResult, FightPlaybackPayload } from "netim2-shared";
import type { PlaybackEventEntry } from "./animations.types";

interface StepContext {
    turnNumber: number;
    fighterId: string;
    targetId: string;
}

export type PlaybackStep =
    | { type: "event"; entry: PlaybackEventEntry; fast: boolean }
    | (StepContext & { type: "modifiers"; attack: CombatAttackPlayback })
    | (StepContext & { type: "hit"; hit: CombatHitResult; totalHits: number })
    | (StepContext & { type: "hit-status"; hit: CombatHitResult });

/** Sustituye las consecuencias de cada ataque por sus snapshots sin duplicar los eventos legacy. */
export const buildPlaybackSteps = (payload: FightPlaybackPayload): PlaybackStep[] =>
    payload.turns.flatMap(turn => turn.fighterTurns.flatMap(fighterTurn => {
        const steps: PlaybackStep[] = [];
        const { attack } = fighterTurn;
        const context = { turnNumber: turn.turnNumber, fighterId: fighterTurn.fighterId, targetId: fighterTurn.targetId };
        let actionStarted = false;
        let hitsStarted = false;
        let modifiersShown = false;
        const insertedHits = new Set<number>();

        for (const event of fighterTurn.events) {
            if (event.type === "action_selected") actionStarted = true;
            if (attack && event.type === "hit_resolved") {
                hitsStarted = true;
                const hit = attack.hits.find(current => current.hitIndex === event.hitIndex);
                if (!hit || insertedHits.has(hit.hitIndex)) continue;
                if (!modifiersShown) {
                    steps.push({ type: "modifiers", ...context, attack });
                    modifiersShown = true;
                }
                steps.push({ type: "hit", ...context, hit, totalHits: attack.modifiers.executedHitCount });
                if (hit.statusEffects.length > 1) {
                    steps.push({ type: "hit-status", ...context, hit });
                }
                insertedHits.add(hit.hitIndex);
                continue;
            }
            if (attack && actionStarted && event.type === "double_hit_triggered") continue;
            if (attack && hitsStarted && (
                event.type === "damage_resolved" || event.type === "healing_resolved"
                || event.type === "status_effect_applied" || event.type === "status_effect_updated"
                || event.type === "status_effect_resisted" || event.type === "status_effect_stack_proc"
            )) continue;
            steps.push({
                type: "event",
                entry: { ...context, fightId: payload.fightId, event },
                fast: Boolean(attack && actionStarted),
            });
        }
        return steps;
    }));
