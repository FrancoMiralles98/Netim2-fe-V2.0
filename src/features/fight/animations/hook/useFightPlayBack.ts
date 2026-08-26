import { useRef, useState } from "react";
import type { FightFighterState } from "../../card/fighter-state";
import type { FightPlaybackState } from "../animations.types";
import type { ActionSelectedEvent, BasicAttackUsedEvent, CooldownUpdatedEvent, DamageResolvedEvent, DoubleHitTriggeredEvent, FightEvent, HitResolvedEvent, ResourceChangedEvent, StatusEffectStackProcEvent, StatusEffectTickedEvent, TurnEndedEvent, TurnStartedEvent } from "netim2-shared";
import type { FightPlaybackSpeed, UseFightPlayBackProps } from "../use-fight-play-back.type";

export const useFightPlayBack = ({ initialFighters, events }: UseFightPlayBackProps) => {
    const [fightersState, setFightersState] = useState<FightFighterState[]>(initialFighters);

    const [playback, setPlayback] = useState<FightPlaybackState>({ currentTurn: 0 });

    const [isPlaying, setIsPlaying] = useState(false);

    const [isPaused, setIsPaused] = useState(false);

    const [speed, setSpeedState] = useState<FightPlaybackSpeed>(1);

    const isPlayingRef = useRef(false);
    const isPausedRef = useRef(false);
    const speedRef = useRef<FightPlaybackSpeed>(1);
    const playbackSessionRef = useRef(0);

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

        while (elapsed < duration) {
            await sleep(16);

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
        }
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

        const sessionId = playbackSessionRef.current;

        try {
            while (
                eventIndexRef.current < events.length &&
                sessionId === playbackSessionRef.current
            ) {
                while (
                    isPausedRef.current &&
                    sessionId === playbackSessionRef.current
                ) {
                    await sleep(16);
                }

                /*
                 * Puede haberse hecho reset mientras
                 * estaba pausada la pelea.
                 */
                if (sessionId !== playbackSessionRef.current) {
                    return;
                }

                const event =
                    events[eventIndexRef.current];

                await playEvent(event);

                /*
                 * Evita avanzar el índice si hubo
                 * un reset durante el evento.
                 */
                if (sessionId !== playbackSessionRef.current) {
                    return;
                }

                eventIndexRef.current += 1;
            }
        } finally {
            /*
             * Solo modificamos el estado si seguimos
             * perteneciendo a esta reproducción.
             */
            if (sessionId === playbackSessionRef.current) {
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

        /*
         * Vuelve al primer FightEvent.
         */
        eventIndexRef.current = 0;

        /*
         * Detiene reproducción y pausa.
         */
        isPlayingRef.current = false;
        isPausedRef.current = false;

        setIsPlaying(false);
        setIsPaused(false);

        /*
         * Restauramos velocidad.
         */
        speedRef.current = 1;
        setSpeedState(1);

        /*
         * Restauramos completamente los fighters.
         *
         * structuredClone evita compartir referencias
         * con el snapshot original.
         */
        setFightersState(
            structuredClone(initialFighters)
        );

        /*
         * Limpiamos todo el estado visual temporal.
         */
        setPlayback({
            currentTurn: 0,
            currentActorId: undefined,
            currentTargetId: undefined,
            currentAction: undefined,
            animation: undefined,
            message: undefined
        });
    };

    const playDoubleHit = async (
        event: DoubleHitTriggeredEvent
    ) => {
        setPlayback(prev => ({
            ...prev,

            currentActorId: event.attackerId,
            currentTargetId: event.targetId,

            hitSequence: {
                current: 0,
                total: event.generatedHitCount
            },

            message: `Golpe x${event.generatedHitCount}`
        }));

        await wait(450);

        setPlayback(prev => ({
            ...prev,
            message: undefined
        }));
    };


    const playEvent = async (
        event: FightEvent
    ): Promise<void> => {

        switch (event.type) {

            case 'turn_started':
                await playTurnStarted(event);
                break;

            case 'action_selected':
                await playActionSelected(event);
                break;

            case 'resource_changed':
                await playResourceChanged(event);
                break;

            case 'basic_attack_used':
                await playBasicAttack(event);
                break;

            case 'double_hit_triggered':
                await playDoubleHit(event);
                break;

            case 'hit_resolved':
                await playHitResolved(event);
                break;

            case 'damage_resolved':
                await playDamageResolved(event);
                break;

            case 'status_effect_ticked':
                await playStatusEffectTicked(event);
                break;

            case 'status_effect_stack_proc':
                await playStatusEffectStackProc(event);
                break;

            case 'turn_ended':
                await playTurnEnded(event);
                break;

            case 'cooldown_updated':
                await playCooldownUpdated(event);
                break;
        }
    };

    const playTurnStarted = async (
        event: TurnStartedEvent
    ) => {
        setPlayback({
            currentTurn: event.turnNumber,
            currentActorId: event.actorId,
            message: undefined
        });

        await wait(400);
    };

    const playCooldownUpdated = async (
        event: CooldownUpdatedEvent
    ) => {
        setFightersState(prev =>
            prev.map(fighter => {
                if (fighter.fighterId !== event.fighterId) {
                    return fighter;
                }

                if (event.remainingTurns <= 0) {
                    return {
                        ...fighter,
                        cooldowns: fighter.cooldowns.filter(
                            cooldown => cooldown.skillId !== event.skillId
                        )
                    };
                }

                return {
                    ...fighter,
                    cooldowns: fighter.cooldowns.map(cooldown =>
                        cooldown.skillId === event.skillId
                            ? {
                                ...cooldown,
                                remainingTurns: event.remainingTurns
                            }
                            : cooldown
                    )
                };
            })
        );
    };

    const playStatusEffectStackProc = async (event: StatusEffectStackProcEvent) => {
        setFightersState(prev =>
            prev.map(fighter => {
                if (fighter.fighterId !== event.targetFighterId) {
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
                    },

                    activeEffects: fighter.activeEffects.map(effect => {
                        if (effect.instanceId !== event.effectInstanceId) {
                            return effect;
                        }

                        if (!effect.stacks) {
                            return effect;
                        }

                        return {
                            ...effect,

                            stacks: {
                                ...effect.stacks,
                                current: event.currentStacks
                            }
                        };
                    })
                };
            })
        );

        setPlayback(prev => ({
            ...prev,

            animation: {
                type: 'status_effect_damage',
                eventId: event.eventId,
                targetId: event.targetFighterId,
                effectId: event.effectId,
                amount: event.appliedDamage
            }
        }));

        await wait(950);

        setPlayback(prev => ({
            ...prev,
            animation: undefined
        }));
    };

    const playResourceChanged = async (event: ResourceChangedEvent) => {
        setFightersState(prev =>
            prev.map(fighter => {
                if (fighter.fighterId !== event.fighterId) {
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

        setPlayback(prev => ({
            ...prev,

            animation: {
                type: 'resource_changed',
                fighterId: event.fighterId,
                resource: event.resource,
                reason: event.reason,
                amount: event.amount,
                eventId: event.eventId,
                increased
            }
        }));

        await wait(950);

        setPlayback(prev => ({
            ...prev,
            animation: undefined
        }));
    };

    const playActionSelected = async (
        event: ActionSelectedEvent
    ) => {

        let targetId: string | undefined;

        switch (event.action.type) {
            case 'basic_attack':
            case 'use_damage_skill':
            case 'use_healing_skill':
            case 'cast_buff':
                targetId = event.action.targetId;
                break;
        }

        setPlayback(prev => ({
            ...prev,

            currentActorId: event.actorId,

            currentTargetId: targetId,

            currentAction: event.action
        }));

        await wait(700);
    };

    const playBasicAttack = async (
        event: BasicAttackUsedEvent
    ) => {

        setPlayback(prev => ({
            ...prev,

            currentActorId: event.attackerId,
            currentTargetId: event.targetId,

            animation: {
                type: 'basic_attack',
                attackerId: event.attackerId,
                targetId: event.targetId
            },

            message: 'Ataque básico'
        }));

        await wait(400);

        setPlayback(prev => ({
            ...prev,
            animation: undefined
        }));
    };

    const playStatusEffectTicked = async (event: StatusEffectTickedEvent
    ) => {
        setFightersState(prev =>
            prev.map(fighter => {
                if (fighter.fighterId !== event.targetFighterId) {
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
                    },

                    activeEffects: fighter.activeEffects.map(effect =>
                        effect.instanceId === event.effectInstanceId
                            ? {
                                ...effect,
                                remainingTurns: event.remainingTurns
                            }
                            : effect
                    )
                };
            })
        );

        setPlayback(prev => ({
            ...prev,

            animation: {
                type: 'status_effect_damage',
                eventId: event.eventId,

                targetId: event.targetFighterId,

                effectId: event.effectId,

                amount: event.appliedDamage
            }
        }));

        await wait(950);

        setPlayback(prev => ({
            ...prev,
            animation: undefined
        }));
    };







    const playHitResolved = async (
        event: HitResolvedEvent
    ) => {
        const resolution = event.resolution;

        setPlayback(prev => ({
            ...prev,

            currentActorId: event.attackerId,
            currentTargetId: event.targetId,

            hitSequence: prev.hitSequence
                ? {
                    ...prev.hitSequence,
                    current: event.hitIndex + 1
                }
                : undefined
        }));

        switch (resolution.result) {

            case 'missed': {
                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'missed',
                        attackerId: event.attackerId,
                        targetId: event.targetId,
                        hitIndex: event.hitIndex
                    },

                    message: 'MISS'
                }));

                await wait(900);

                break;
            }

            case 'dodged': {
                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'dodged',
                        attackerId: event.attackerId,
                        targetId: event.targetId,
                        hitIndex: event.hitIndex
                    },

                    message: 'ESQUIVADO'
                }));

                await wait(500);

                break;
            }

            case 'blocked': {
                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'blocked',
                        attackerId: event.attackerId,
                        targetId: event.targetId,
                        hitIndex: event.hitIndex
                    },

                    message: 'BLOQUEADO'
                }));

                await wait(500);

                break;
            }

            case 'hit': {
                setPlayback(prev => ({
                    ...prev,

                    animation: {
                        type: 'hit',
                        attackerId: event.attackerId,
                        targetId: event.targetId,
                        hitIndex: event.hitIndex,

                        critical: resolution.critical,
                        penetrating: resolution.penetrating
                    },

                    message:
                        resolution.critical
                            ? 'CRÍTICO'
                            : undefined
                }));

                await wait(400);

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
        event: DamageResolvedEvent
    ) => {

        setPlayback(prev => ({
            ...prev,

            animation: {
                type: 'damage',
                targetId: event.targetFighterId,
                amount: event.resolution.appliedDamage,
                critical: event.critical,
                damageType: event.resolution.damageType
            }
        }));

        setFightersState(current =>
            current.map(fighter => {

                if (
                    fighter.fighterId !==
                    event.targetFighterId
                ) {
                    return fighter;
                }

                return {
                    ...fighter,

                    alive: !event.targetDefeated,

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
        event: TurnEndedEvent
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
                    event.actorId
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
        isPaused,
        speed,
        changeSpeed,
        reset
    };
}