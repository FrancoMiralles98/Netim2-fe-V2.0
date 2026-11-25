import { useEffect, useMemo, useRef, useState } from "react";
import type { FightAuraState, FightBuffState, FightFighterState, FightStatusEffectState } from "../../card/fighter-state";
import type { FightPlaybackState, HitVisual, PlaybackEventEntry } from "../animations.types";
import type { ActionSelectedEvent, AuraActivatedEvent, AuraDeactivatedEvent, AuraDurationUpdatedEvent, BasicAttackUsedEvent, BuffAppliedEvent, BuffDeactivatedEvent, BuffDurationUpdatedEvent, ControlEffectProcessedEvent, CooldownUpdatedEvent, DamageResolvedEvent, DoubleHitTriggeredEvent, FightResult, HealingResolvedEvent, HitResolvedEvent, ResourceChangedEvent, StatusEffectAppliedEvent, StatusEffectDurationUpdatedEvent, StatusEffectStackProcEvent, StatusEffectTickedEvent, StatusEffectUpdatedEvent, TurnEndedEvent, TurnStartedEvent } from "netim2-shared";
import type { FightPlaybackSpeed, UseFightPlayBackProps } from "../use-fight-play-back.type";
import { getSkillEffect } from "../skill-effects";
import { buildPlaybackSteps, type PlaybackStep } from "../build-playback-steps";
import { applyCombatHit, applyHitStatus, getHitVisuals, getHitStatusNotice, getModifierNotice } from "../hit-presentation";

const HIT_INTERVAL_MS = 450;
const HIT_VISUAL_DURATION_MS = 1000;
const PLAYBACK_CANCELLED = Symbol("playback-cancelled");

export const useFightPlayBack = ({ initialFighters, events, result }: UseFightPlayBackProps) => {
    const [fightersState, setFightersState] = useState<FightFighterState[]>(() => structuredClone(initialFighters));

    const [playback, setPlayback] = useState<FightPlaybackState>({ currentTurn: 0 });

    const [isPlaying, setIsPlaying] = useState(false);

    const [isPaused, setIsPaused] = useState(false);

    const [speed, setSpeedState] = useState<FightPlaybackSpeed>(1);

    const isPlayingRef = useRef(false);
    const isPausedRef = useRef(false);
    const speedRef = useRef<FightPlaybackSpeed>(1);
    const playbackSessionRef = useRef(0);
    const floatingAnimationSequenceRef = useRef(0);
    const visualClockRef = useRef(0);
    const hitVisualsRef = useRef<HitVisual[]>([]);

    useEffect(() => () => {
        playbackSessionRef.current += 1;
        isPlayingRef.current = false;
    }, []);

    const getNextFloatingAnimationId = (): string => {
        floatingAnimationSequenceRef.current += 1;

        return [
            playbackSessionRef.current,
            floatingAnimationSequenceRef.current
        ].join(':');
    };

    const [fightResult, setFightResult] = useState<FightResult | null>(null);

    const closeFightResult = (): void => {
        setFightResult(null);
    };

    const playbackEvents = useMemo<PlaybackStep[]>(
        () => {
            if (!events) {
                return [];
            }

            return buildPlaybackSteps(events);
        },
        [events]
    );

    /*
     * Índice del siguiente evento a reproducir.
     * permite continuar desde donde quedó
     * la reproducción.
     */
    const eventIndexRef = useRef(0);

    const sleep = (ms: number) =>
        new Promise<void>(resolve =>
            setTimeout(resolve, ms)
        );

    const wait = async (
        duration: number
    ): Promise<void> => {

        let elapsed = 0;
        let previousTime = performance.now();
        const session = playbackSessionRef.current;

        while (elapsed < duration && session === playbackSessionRef.current) {
            await sleep(16);
            if (session !== playbackSessionRef.current) throw PLAYBACK_CANCELLED;

            const currentTime = performance.now();

            const delta = currentTime - previousTime;

            previousTime = currentTime;

            /*
             * Mientras está pausado el tiempo
             * de reproducción no avanza.
             */
            if (isPausedRef.current) {
                continue;
            }

            /*
             * x2 hace avanzar el reloj dos veces
             * más rápido, x0.5 dos veces más lento.
             */
            elapsed += delta * speedRef.current;
            visualClockRef.current += delta * speedRef.current;
            if (hitVisualsRef.current.some(visual => visual.expiresAt <= visualClockRef.current)) {
                const remaining = hitVisualsRef.current.filter(visual => visual.expiresAt > visualClockRef.current);
                hitVisualsRef.current = remaining;
                setPlayback(current => ({ ...current, hitVisuals: remaining }));
            }
        }
        if (session !== playbackSessionRef.current) throw PLAYBACK_CANCELLED;
    };

    const pause = (): void => {
        if (!isPlayingRef.current) {
            return;
        }

        isPausedRef.current = true;
        setIsPaused(true);
    };

    const changeSpeed = (
        newSpeed: FightPlaybackSpeed
    ): void => {
        speedRef.current = newSpeed;
        setSpeedState(newSpeed);
    };

    const play = async (): Promise<void> => {

        if (isPlayingRef.current) {

            if (isPausedRef.current) {
                isPausedRef.current = false;
                setIsPaused(false);
            }

            return;
        }

        isPlayingRef.current = true;
        isPausedRef.current = false;

        setIsPlaying(true);
        setIsPaused(false);

        const sessionId =
            playbackSessionRef.current;

        try {

            while (
                eventIndexRef.current <
                playbackEvents.length &&
                sessionId ===
                playbackSessionRef.current
            ) {

                while (
                    isPausedRef.current &&
                    sessionId ===
                    playbackSessionRef.current
                ) {
                    await sleep(16);
                }

                if (
                    sessionId !==
                    playbackSessionRef.current
                ) {
                    return;
                }

                const playbackEntry =
                    playbackEvents[
                    eventIndexRef.current
                    ];

                if (playbackEntry.type === "event") {
                    await playEvent(playbackEntry.entry, playbackEntry.fast);
                } else {
                    await playAttackStep(playbackEntry);
                }

                if (
                    sessionId !==
                    playbackSessionRef.current
                ) {
                    return;
                }

                eventIndexRef.current += 1;
            }

            /*
             * La reproducción terminó correctamente.
             */
            const playbackFinished =
                eventIndexRef.current >=
                playbackEvents.length;

            if (
                playbackFinished &&
                result &&
                sessionId ===
                playbackSessionRef.current
            ) {
                await wait(HIT_VISUAL_DURATION_MS);
                showFightResult(
                    result
                );
            }

        } catch (error) {
            if (error !== PLAYBACK_CANCELLED) throw error;
        } finally {

            if (
                sessionId ===
                playbackSessionRef.current
            ) {
                isPlayingRef.current = false;
                isPausedRef.current = false;

                setIsPlaying(false);
                setIsPaused(false);
            }
        }
    };

    const reset = (): void => {
        /*
         * Invalida cualquier reproducción async
         * que todavía esté ejecutándose.
         */
        playbackSessionRef.current += 1;
        floatingAnimationSequenceRef.current = 0;
        visualClockRef.current = 0;
        hitVisualsRef.current = [];

        eventIndexRef.current = 0;

        isPlayingRef.current = false;
        isPausedRef.current = false;

        setIsPlaying(false);
        setIsPaused(false);
        setFightResult(null);


        speedRef.current = 1;
        setSpeedState(1);


        setFightersState(
            structuredClone(initialFighters)
        );


        setPlayback({
            currentTurn: 0,
            currentActorId: undefined,
            currentTargetId: undefined,
            currentAction: undefined,
            animation: undefined,
            message: undefined
        });
    };

    const showFightResult = (
        result: FightResult
    ): void => {

        setPlayback(prev => ({
            ...prev,

            currentActorId: undefined,
            currentTargetId: undefined,
            currentAction: undefined,

            animation: undefined,
            skillEffect: undefined,
            hitSequence: undefined,
            message: undefined
        }));

        setFightResult(result);
    };

    const playDoubleHit = async (
        event: DoubleHitTriggeredEvent,
        fighterId: string,
        targetId: string
    ): Promise<void> => {

        setPlayback(prev => ({
            ...prev,

            currentActorId:
                fighterId,

            currentTargetId:
                targetId,

            hitSequence: {
                current: 0,
                total:
                    event.generatedHitCount
            },

            message:
                `Golpe x${event.generatedHitCount}`
        }));

        await wait(950);

        setPlayback(prev => ({
            ...prev,
            message: undefined
        }));
    };


    const addHitVisuals = (contents: ReturnType<typeof getHitVisuals>) => {
        const visuals = [...hitVisualsRef.current];
        for (const content of contents) {
            const occupied = new Set(visuals.filter(visual => visual.fighterId === content.fighterId).map(visual => visual.lane));
            let lane = 0;
            while (occupied.has(lane)) lane += 1;
            visuals.push({
                ...content,
                id: getNextFloatingAnimationId(),
                expiresAt: visualClockRef.current + HIT_VISUAL_DURATION_MS,
                lane,
            });
        }
        hitVisualsRef.current = visuals;
        setPlayback(current => ({ ...current, hitVisuals: visuals }));
    };

    const playAttackStep = async (step: Exclude<PlaybackStep, { type: "event" }>) => {
        if (step.type === "modifiers") {
            const text = getModifierNotice(step.attack.modifiers);
            if (text) {
                addHitVisuals([{ type: "notice", fighterId: step.fighterId, text, colorClass: "text-yellow-300" }]);
            }
            setPlayback(current => ({ ...current, hitSequence: { current: 0, total: step.attack.modifiers.executedHitCount } }));
            await wait(HIT_INTERVAL_MS);
            return;
        }
        if (step.type === "hit-status") {
            const notices = step.hit.statusEffects.map(effect => getHitStatusNotice(step.hit, effect));
            addHitVisuals([{
                type: "notice",
                fighterId: step.hit.targetId,
                text: notices.map(notice => notice.text).join(" · "),
                colorClass: "text-slate-200",
                parts: notices.map(({ text, colorClass }) => ({ text, colorClass })),
            }]);
            await wait(HIT_INTERVAL_MS);
            return;
        }
        const { hit } = step;
        setFightersState(current => {
            let fighters = applyCombatHit(current, hit);
            for (const effect of hit.statusEffects) {
                fighters = applyHitStatus(fighters, hit, effect);
            }
            return fighters;
        });
        setPlayback(current => ({
            ...current,
            currentActorId: hit.attackerId,
            currentTargetId: hit.targetId,
            hitSequence: { current: hit.hitIndex + 1, total: step.totalHits },
            animation: hit.outcome === "hit" ? {
                type: "hit", attackerId: hit.attackerId, targetId: hit.targetId,
                hitIndex: hit.hitIndex, critical: hit.critical, penetrating: hit.penetrating,
            } : undefined,
        }));
        addHitVisuals(getHitVisuals(hit, getNextFloatingAnimationId));
        await wait(HIT_INTERVAL_MS);
    };

    const playEvent = async (
        entry: PlaybackEventEntry,
        fast = false,
    ): Promise<void> => {

        const {
            event,
            turnNumber,
            fighterId,
            targetId
        } = entry;

        switch (event.type) {

            case 'turn_started':
                await playTurnStarted(
                    event,
                    turnNumber,
                    fighterId
                );
                break;

            case 'action_selected':
                await playActionSelected(
                    event,
                    fighterId,
                    targetId,
                    fast,
                );
                break;

            case 'resource_changed':
                await playResourceChanged(event, fighterId);
                break;

            case 'basic_attack_used':
                await playBasicAttack(
                    event,
                    fighterId,
                    targetId,
                    fast,
                );
                break;

            case 'double_hit_triggered':
                await playDoubleHit(
                    event,
                    fighterId,
                    targetId
                );
                break;

            case 'hit_resolved':
                await playHitResolved(
                    event,
                    fighterId,
                    targetId
                );
                break;

            case 'damage_resolved':
                await playDamageResolved(event, targetId);
                break;

            case 'status_effect_ticked':
                await playStatusEffectTicked(event, fighterId);
                break;

            case 'control_effect_processed':
                await playControlEffectProcessed(event);
                break;

            case 'status_effect_stack_proc':
                await playStatusEffectStackProc(event, fighterId);
                break;

            case 'status_effect_duration_updated':
                playStatusEffectDurationUpdated(event, fighterId);
                break;

            case 'aura_duration_updated':
                playAuraDurationUpdated(event, fighterId);
                break;

            case 'aura_deactivated':
                playAuraDeactivated(event, fighterId);
                break;

            case 'status_effect_applied':
                playStatusEffectApplied(event, fighterId, targetId);
                break;

            case 'buff_duration_updated':
                playBuffDurationUpdated(event, fighterId);
                break;

            case 'buff_deactivated':
                playBuffDeactivated(event, fighterId);
                break;

            case 'healing_resolved':
                await playHealingResolved(event, fighterId);
                break;

            case 'status_effect_updated':
                playStatusEffectUpdated(event, fighterId, targetId);
                break;

            case 'status_effect_deactivated':
                setFightersState(current => current.map(fighter => {
                    if (fighter.fighterId !== event.targetFighterId) return fighter;
                    const activeEffects = new Map(fighter.activeEffects);
                    activeEffects.delete(event.effectId);
                    return { ...fighter, activeEffects };
                }));
                break;

            case 'turn_ended':
                await playTurnEnded(event, fighterId);
                break;

            case 'cooldown_updated':
                playCooldownUpdated(event, fighterId);
                break;

            case 'aura_activated':
                playAuraActivated(event, fighterId);
                break;

            case 'buff_applied':
                playBuffApplied(event, fighterId, targetId);
                break;
        }
    };

    const playBuffApplied = (
        event: BuffAppliedEvent,
        sourceId: string,
        targetId: string
    ): void => {

        setFightersState(current => {

            const sourceFighter =
                current.find(
                    fighter =>
                        fighter.fighterId ===
                        sourceId
                );

            const skill =
                sourceFighter?.skills.find(
                    skill =>
                        skill.skillId ===
                        event.skillId
                );

            return current.map(fighter => {

                if (
                    fighter.fighterId !==
                    targetId
                ) {
                    return fighter;
                }

                const newBuff:
                    FightBuffState = {

                    buffId:
                        event.skillId,

                    name:
                        skill?.name ??
                        'Buff',

                    mastery:
                        skill?.mastery ??
                        'N',

                    description:
                        skill?.description,

                    sourceFighterId:
                        sourceId,

                    remainingTurns:
                        event.remainingTurns
                };

                const activeBuffs =
                    new Map(
                        fighter.activeBuffs
                    );

                activeBuffs.set(
                    event.skillId,
                    newBuff
                );

                return {
                    ...fighter,
                    activeBuffs
                };
            });
        });
    };

    const playAuraActivated = (
        event: AuraActivatedEvent,
        fighterId: string
    ): void => {

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    fighterId
                ) {
                    return fighter;
                }

                const skill =
                    fighter.skills.find(
                        skill =>
                            skill.skillId ===
                            event.skillId
                    );

                const newAura:
                    FightAuraState = {

                    auraId:
                        event.skillId,

                    name:
                        skill?.name ??
                        'Aura',

                    mastery:
                        skill?.mastery ??
                        'N',

                    description:
                        skill?.description,

                    sourceFighterId:
                        fighterId,

                    remainingTurns:
                        event.remainingTurns
                };

                const activeAuras =
                    new Map(
                        fighter.activeAuras
                    );

                activeAuras.set(
                    event.skillId,
                    newAura
                );

                return {
                    ...fighter,
                    activeAuras
                };
            })
        );
    };

    const playStatusEffectUpdated = (
        event: StatusEffectUpdatedEvent,
        sourceId: string,
        targetId: string
    ): void => {

        const effect =
            event.current;

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    targetId
                ) {
                    return fighter;
                }

                const activeEffects =
                    new Map(
                        fighter.activeEffects
                    );

                activeEffects.set(
                    effect.effectId,
                    {
                        effectId:
                            effect.effectId,

                        sourceFighterId:
                            sourceId,

                        remainingTurns:
                            effect.remainingTurns,

                        damage:
                            effect.damagePerTick,

                        stacks:
                            effect.stacks
                    }
                );

                return {
                    ...fighter,
                    activeEffects
                };
            })
        );
    };

    const playStatusEffectApplied = (
        event: StatusEffectAppliedEvent,
        sourceId: string,
        targetId: string
    ): void => {

        const effect =
            event.effect;

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    targetId
                ) {
                    return fighter;
                }

                const newEffect:
                    FightStatusEffectState = {

                    effectId:
                        effect.effectId,

                    sourceFighterId:
                        sourceId,

                    remainingTurns:
                        effect.remainingTurns,

                    damage:
                        effect.damagePerTick,

                    stacks:
                        effect.stacks
                };

                const activeEffects =
                    new Map(
                        fighter.activeEffects
                    );

                /*
                 * set() agrega o reemplaza.
                 */
                activeEffects.set(
                    effect.effectId,
                    newEffect
                );

                return {
                    ...fighter,
                    activeEffects
                };
            })
        );
    };

    const playHealingResolved = async (
        event: HealingResolvedEvent,
        targetId: string
    ): Promise<void> => {

        /*
         * Curación REAL aplicada.
         *
         * Usamos los snapshots del backend para contemplar
         * correctamente casos de overhealing.
         */
        const appliedHealing = event.resolution.appliedHealing

        /*
         * Actualizamos el HP autoritativo.
         */
        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    targetId
                ) {
                    return fighter;
                }

                return {
                    ...fighter,

                    resources: {
                        ...fighter.resources,

                        hp: {
                            ...fighter.resources.hp,
                            current: event.targetCurrentHp
                        }
                    }
                };
            })
        );

        /*
         * Mostramos la curación solamente si
         * realmente recuperó HP.
         */
        if (appliedHealing > 0) {
            const animationId = getNextFloatingAnimationId();

            setPlayback(prev => ({
                ...prev,

                animation: {
                    type: 'healing',
                    id: animationId,
                    targetId: targetId,
                    critical: event.resolution.critical,
                    amount:
                        appliedHealing
                }
            }));

            await wait(900);

            setPlayback(prev => ({
                ...prev,
                animation: undefined,
                message: undefined
            }));
        }
    };

    const playTurnStarted = async (
        _event: TurnStartedEvent,
        turnNumber: number,
        fighterId: string
    ): Promise<void> => {

        setPlayback(current => ({
            currentTurn: turnNumber,

            currentActorId:
                fighterId,

            message: undefined,
            hitVisuals: current.hitVisuals,
        }));

        await wait(400);
    };

    const playBuffDurationUpdated = (
        event: BuffDurationUpdatedEvent,
        fighterId: string,
    ): void => {

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    fighterId
                ) {
                    return fighter;
                }

                const activeBuffs =
                    new Map(
                        fighter.activeBuffs
                    );

                if (
                    event.remainingTurns <= 0
                ) {
                    activeBuffs.delete(
                        event.skillId
                    );

                    return {
                        ...fighter,
                        activeBuffs
                    };
                }

                const buff =
                    activeBuffs.get(
                        event.skillId
                    );

                if (!buff) {
                    return fighter;
                }

                activeBuffs.set(
                    event.skillId,
                    {
                        ...buff,

                        remainingTurns:
                            event.remainingTurns
                    }
                );

                return {
                    ...fighter,
                    activeBuffs
                };
            })
        );
    };

    const playBuffDeactivated = (
        event: BuffDeactivatedEvent,
        fighterId: string
    ): void => {
        setFightersState(current =>
            current.map(fighter => {
                if (
                    fighter.fighterId !== fighterId ||
                    !fighter.activeBuffs.has(event.skillId)
                ) {
                    return fighter;
                }

                const activeBuffs = new Map(fighter.activeBuffs);
                activeBuffs.delete(event.skillId);

                return {
                    ...fighter,
                    activeBuffs
                };
            })
        );
    };

    const playAuraDurationUpdated = (
        event: AuraDurationUpdatedEvent,
        fighterId: string
    ): void => {

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    fighterId
                ) {
                    return fighter;
                }

                const activeAuras =
                    new Map(
                        fighter.activeAuras
                    );

                if (
                    event.remainingTurns <= 0
                ) {
                    activeAuras.delete(
                        event.skillId
                    );

                    return {
                        ...fighter,
                        activeAuras
                    };
                }

                const aura =
                    activeAuras.get(
                        event.skillId
                    );

                if (!aura) {
                    return fighter;
                }

                activeAuras.set(
                    event.skillId,
                    {
                        ...aura,

                        remainingTurns:
                            event.remainingTurns
                    }
                );

                return {
                    ...fighter,
                    activeAuras
                };
            })
        );
    };

    const playAuraDeactivated = (
        event: AuraDeactivatedEvent,
        fighterId: string
    ): void => {
        setFightersState(current =>
            current.map(fighter => {
                if (
                    fighter.fighterId !== fighterId ||
                    !fighter.activeAuras.has(event.skillId)
                ) {
                    return fighter;
                }

                const activeAuras = new Map(fighter.activeAuras);
                activeAuras.delete(event.skillId);

                return {
                    ...fighter,
                    activeAuras
                };
            })
        );
    };

    const playCooldownUpdated = (event: CooldownUpdatedEvent, fighterId: string): void => {
        setFightersState(prev =>
            prev.map(fighter => {

                if (
                    fighter.fighterId !==
                    fighterId
                ) {
                    return fighter;
                }

                /*
                 * Si llegó a 0, eliminamos el cooldown.
                 */
                if (event.remainingTurns <= 0) {
                    return {
                        ...fighter,

                        cooldowns:
                            fighter.cooldowns.filter(
                                cooldown =>
                                    cooldown.skillId !==
                                    event.skillId
                            )
                    };
                }

                const cooldownExists =
                    fighter.cooldowns.some(
                        cooldown =>
                            cooldown.skillId ===
                            event.skillId
                    );

                /*
                 * Si no existe, lo agregamos.
                 */
                if (!cooldownExists) {
                    return {
                        ...fighter,

                        cooldowns: [
                            ...fighter.cooldowns,

                            {
                                skillId: event.skillId,

                                initialTurns:
                                    event.remainingTurns,

                                remainingTurns:
                                    event.remainingTurns
                            }
                        ]
                    };
                }

                /*
                 * Si ya existe, actualizamos
                 * únicamente sus turnos restantes.
                 */
                return {
                    ...fighter,

                    cooldowns:
                        fighter.cooldowns.map(
                            cooldown =>
                                cooldown.skillId ===
                                    event.skillId
                                    ? {
                                        ...cooldown,

                                        remainingTurns:
                                            event.remainingTurns
                                    }
                                    : cooldown
                        )
                };
            })
        );
    };

    const playControlEffectProcessed = async (event: ControlEffectProcessedEvent): Promise<void> => {

        /*
         * El efecto fue procesado pero no impidió
         * la acción, por lo tanto no mostramos nada.
         */
        if (!event.preventedAction) {
            return;
        }

        switch (event.controlType) {

            case 'stun': {
                setPlayback(prev => ({
                    ...prev,

                    currentActorId: event.fighterId,

                    /*
                     * No hay acción ni target porque
                     * el stun impidió actuar.
                     */
                    currentTargetId: undefined,
                    currentAction: undefined,

                    animation: {
                        type: 'stunned',

                        fighterId: event.fighterId,

                        remainingTurns:
                            event.remainingTurns,

                        expired:
                            event.expired
                    },

                    message: 'STUNNED'
                }));

                await wait(900);

                setPlayback(prev => ({
                    ...prev,

                    animation: undefined,
                    message: undefined
                }));

                break;
            }
        }
    };

    const playStatusEffectDurationUpdated = (
        event: StatusEffectDurationUpdatedEvent,
        targetId: string
    ): void => {

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    targetId
                ) {
                    return fighter;
                }

                const activeEffects =
                    new Map(
                        fighter.activeEffects
                    );

                /*
                 * Llegó a 0 → eliminar.
                 */
                if (
                    event.remainingTurns <= 0
                ) {
                    activeEffects.delete(
                        event.effectId
                    );

                    return {
                        ...fighter,
                        activeEffects
                    };
                }

                const effect =
                    activeEffects.get(
                        event.effectId
                    );

                if (!effect) {
                    return fighter;
                }

                activeEffects.set(
                    event.effectId,
                    {
                        ...effect,

                        remainingTurns:
                            event.remainingTurns
                    }
                );

                return {
                    ...fighter,
                    activeEffects
                };
            })
        );
    };

    const playStatusEffectStackProc = async (
        event: StatusEffectStackProcEvent,
        targetId: string
    ): Promise<void> => {

        const animationId = getNextFloatingAnimationId();

        setFightersState(prev =>
            prev.map(fighter => {

                if (
                    fighter.fighterId !==
                    targetId
                ) {
                    return fighter;
                }

                const activeEffects =
                    new Map(
                        fighter.activeEffects
                    );

                const effect =
                    activeEffects.get(
                        event.effectId
                    );

                if (
                    effect &&
                    effect.stacks
                ) {
                    activeEffects.set(
                        event.effectId,
                        {
                            ...effect,

                            stacks: {
                                ...effect.stacks,

                                current:
                                    event.currentStacks
                            }
                        }
                    );
                }

                return {
                    ...fighter,

                    resources: {
                        ...fighter.resources,

                        hp: {
                            ...fighter.resources.hp,

                            current:
                                event.targetCurrentHp
                        }
                    },

                    activeEffects
                };
            })
        );

        setPlayback(prev => ({
            ...prev,

            animation: {
                type:
                    'status_effect_damage',

                id: animationId,

                targetId:
                    targetId,

                effectId:
                    event.effectId,

                amount:
                    event.appliedDamage
            }
        }));

        await wait(950);

        setPlayback(prev => ({
            ...prev,
            animation: undefined
        }));
    };

    const playResourceChanged = async (event: ResourceChangedEvent, fighterId: string) => {
        const animationId = getNextFloatingAnimationId();

        setFightersState(prev =>
            prev.map(fighter => {
                if (fighter.fighterId !== fighterId) {
                    return fighter;
                }

                if (event.resource === 'hp') {
                    return {
                        ...fighter,
                        resources: {
                            ...fighter.resources,
                            hp: {
                                ...fighter.resources.hp,
                                current: event.currentValue
                            }
                        }
                    };
                }

                return {
                    ...fighter,
                    resources: {
                        ...fighter.resources,
                        mana: {
                            ...fighter.resources.mana,
                            current: event.currentValue
                        }
                    }
                };
            })
        );

        const increased =
            event.currentValue > event.previousValue;

        addHitVisuals([{
            type: "value",
            fighterId,
            animation: {
                type: 'resource_changed',
                id: animationId,
                fighterId: fighterId,
                critical: false,
                resource: event.resource,
                reason: 'aura_upkeep',
                amount: event.amount,
                increased
            }
        }]);
        await wait(HIT_INTERVAL_MS);
    };

    const playActionSelected = async (
        event: ActionSelectedEvent,
        fighterId: string,
        targetId: string,
        fast = false,
    ): Promise<void> => {
        const sheet = "skillId" in event.action
            ? getSkillEffect(event.action.skillId)
            : undefined;
        const skillEffect = sheet && "skillId" in event.action
            ? {
                id: getNextFloatingAnimationId(),
                fighterId: event.action.type === "use_damage_skill" ? targetId : fighterId,
                sourceFighterId: fighterId,
                skillId: event.action.skillId,
            }
            : undefined;

        setPlayback(prev => ({
            ...prev,

            currentActorId:
                fighterId,

            currentTargetId:
                targetId,

            currentAction:
                event.action,
            skillEffect,
        }));

        if (fast) {
            await wait(HIT_INTERVAL_MS);
            return;
        }
        await wait(sheet ? Math.max(700, sheet.frameCount / sheet.fps * 1000) : 700);

        if (skillEffect) {
            setPlayback(prev => prev.skillEffect?.id === skillEffect.id
                ? { ...prev, skillEffect: undefined }
                : prev);
        }
    };

    const playBasicAttack = async (
        _event: BasicAttackUsedEvent,
        fighterId: string,
        targetId: string,
        fast = false,
    ): Promise<void> => {

        setPlayback(prev => ({
            ...prev,

            currentActorId:
                fighterId,

            currentTargetId:
                targetId,

            animation: {
                type: 'basic_attack',

                attackerId:
                    fighterId,

                targetId
            }
        }));

        await wait(fast ? HIT_INTERVAL_MS : 400);

        setPlayback(prev => ({
            ...prev,
            animation: undefined
        }));
    };

    const playStatusEffectTicked = async (
        event: StatusEffectTickedEvent,
        targetId: string
    ): Promise<void> => {

        const animationId = getNextFloatingAnimationId();

        setFightersState(prev =>
            prev.map(fighter => {

                if (
                    fighter.fighterId !==
                    targetId
                ) {
                    return fighter;
                }

                const activeEffects =
                    new Map(
                        fighter.activeEffects
                    );

                const effect =
                    activeEffects.get(
                        event.effectId
                    );

                if (effect) {
                    activeEffects.set(
                        event.effectId,
                        {
                            ...effect,

                            remainingTurns:
                                event.remainingTurns
                        }
                    );
                }

                return {
                    ...fighter,

                    resources: {
                        ...fighter.resources,

                        hp: {
                            ...fighter.resources.hp,

                            current:
                                event.targetCurrentHp
                        }
                    },

                    activeEffects
                };
            })
        );

        setPlayback(prev => ({
            ...prev,

            animation: {
                type:
                    'status_effect_damage',

                id: animationId,

                targetId:
                    targetId,

                effectId:
                    event.effectId,

                amount:
                    event.appliedDamage
            }
        }));

        await wait(950);

        setPlayback(prev => ({
            ...prev,
            animation: undefined
        }));
    };







    const playHitResolved = async (
        event: HitResolvedEvent,
        fighterId: string,
        targetId: string
    ): Promise<void> => {

        const resolution =
            event.resolution;

        setPlayback(prev => ({
            ...prev,

            currentActorId:
                fighterId,

            currentTargetId:
                targetId,

            hitSequence:
                prev.hitSequence
                    ? {
                        ...prev.hitSequence,

                        current:
                            event.hitIndex + 1
                    }
                    : undefined
        }));

        switch (resolution.result) {

            case 'missed': {

                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'missed',

                        attackerId:
                            fighterId,

                        targetId,

                        hitIndex:
                            event.hitIndex
                    },
                }));

                await wait(900);

                break;
            }

            case 'dodged': {

                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'dodged',

                        attackerId:
                            fighterId,

                        targetId,

                        hitIndex:
                            event.hitIndex
                    },
                }));

                await wait(900);

                break;
            }

            case 'blocked': {

                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'blocked',

                        attackerId:
                            fighterId,

                        targetId,

                        hitIndex:
                            event.hitIndex
                    },
                }));

                await wait(900);

                break;
            }

            case 'hit': {

                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'hit',

                        attackerId:
                            fighterId,

                        targetId,

                        hitIndex:
                            event.hitIndex,
                        critical: false,
                        penetrating: false,
                    }
                }));

                await wait(100);

                break;
            }
        }

        setPlayback(prev => ({
            ...prev,

            animation: undefined,
            message: undefined
        }));
    };

    const playDamageResolved = async (
        event: DamageResolvedEvent,
        targetId: string
    ) => {

        const animationId = getNextFloatingAnimationId();
        const damageTargetId = event.source.type === 'reflected'
            ? event.source.originalAttackerId
            : targetId;

        setPlayback(prev => ({
            ...prev,

            animation: {
                type: 'damage',
                id: animationId,
                targetId: damageTargetId,
                penetrating: event.penetrating,
                amount: event.resolution.appliedDamage,
                critical: event.critical,
                damageType: event.resolution.damageType
            }
        }));

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    damageTargetId
                ) {
                    return fighter;
                }

                return {
                    ...fighter,

                    alive: event.source.type === 'reflected'
                        ? event.targetCurrentHp > 0
                        : !event.targetDefeated,

                    resources: {
                        ...fighter.resources,

                        hp: {
                            ...fighter.resources.hp,
                            current: event.targetCurrentHp
                        }
                    }
                };
            })
        );

        await wait(1050);

        setPlayback(prev => ({
            ...prev,
            animation: undefined,
            message: undefined
        }));
    };

    const playTurnEnded = async (
        event: TurnEndedEvent,
        actorId: string
    ) => {

        /*
         * También podés sincronizar HP/Mana
         * por seguridad con el snapshot enviado
         * por backend.
         */
        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    actorId
                ) {
                    return fighter;
                }

                return {
                    ...fighter,

                    alive: event.actorAlive,

                    resources: {
                        hp: {
                            ...fighter.resources.hp,
                            current:
                                event.actorCurrentHp
                        },

                        mana: {
                            ...fighter.resources.mana,
                            current:
                                event.actorCurrentMana
                        }
                    }
                };
            })
        );

        await wait(200);

        setPlayback(prev => ({
            ...prev,

            currentActorId: undefined,
            currentTargetId: undefined,
            currentAction: undefined,
            animation: undefined,
            message: undefined
        }));

        await wait(200);
    };

    return {
        fightersState,
        playback,
        play,
        pause,
        isPlaying,
        fightResult,
        closeFightResult,
        isPaused,
        speed,
        changeSpeed,
        reset
    };
}
