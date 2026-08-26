import { useState } from "react";
import { FightActiveEffects } from "./components/icons/FightActiveEffects";
import type { FightFighterState } from "./fighter-state";
import { ExpandedFighterCard } from "./ExpandedFighterCard";
import { CompactFighterCard } from "./CompactFighterCard";
import type { CombatAction } from "netim2-shared";
import { FightActionIndicator } from "../animations/components/FightActionIndicator";
import type { FightAnimationState } from "../animations/animations.types";
import { getStatusEffectDamageColor } from "../animations/utils/animation-utils";

export interface FightFighterCardProps {
    fighter: FightFighterState;
    fighters: FightFighterState[];

    isCurrentActor?: boolean;
    isCurrentTarget?: boolean;

    selectedAction?: CombatAction;

    animation?: FightAnimationState;
}

export const FightFighterCard = ({
    fighter,
    fighters,
    isCurrentActor = false,
    isCurrentTarget = false,
    selectedAction,
    animation
}: FightFighterCardProps) => {

    const [expanded, setExpanded] = useState(false);


    /*
     * Resolución visual del hit.
     */
    const isHit =
        animation?.type === 'hit' &&
        animation.targetId === fighter.fighterId;

    const isDodging =
        animation?.type === 'dodged' &&
        animation.targetId === fighter.fighterId;

    const isBlocking =
        animation?.type === 'blocked' &&
        animation.targetId === fighter.fighterId;

    const attackMissed =
        animation?.type === 'missed' &&
        animation.targetId === fighter.fighterId;

    const isTakingDamage =
        animation?.type === 'damage' &&
        animation.targetId === fighter.fighterId;

    /*
     * Animación física de la card.
     */
    const hitAnimationClass =
        isHit
            ? animation.critical
                ? 'animate-[fight-critical-hit_450ms_ease-out]'
                : 'animate-[fight-hit_350ms_ease-out]'
            : '';

    const dodgeAnimationClass =
        isDodging
            ? fighter.side === 'allies'
                ? 'animate-[fight-dodge-left_450ms_ease-out]'
                : 'animate-[fight-dodge-right_450ms_ease-out]'
            : '';

    const blockAnimationClass =
        isBlocking
            ? 'animate-[fight-block_400ms_ease-out]'
            : '';

    const damageColorClass =
        isTakingDamage
            ? {
                ad: 'text-orange-400',
                ap: 'text-cyan-400',
                true: 'text-white'
            }[animation.damageType]
            : '';

    const resourceAnimation =
        animation?.type === 'resource_changed' &&
            animation.fighterId === fighter.fighterId
            ? animation
            : undefined;

    const statusEffectDamageAnimation =
        animation?.type === 'status_effect_damage' &&
            animation.targetId === fighter.fighterId
            ? animation
            : undefined;

    /*
     * Recursos.
     */
    const hpPercent =
        fighter.resources.hp.max > 0
            ? (
                fighter.resources.hp.current /
                fighter.resources.hp.max
            ) * 100
            : 0;

    const manaPercent =
        fighter.resources.mana.max > 0
            ? (
                fighter.resources.mana.current /
                fighter.resources.mana.max
            ) * 100
            : 0;

    return (
        <div
            className={`
                relative
                mt-9
                transition-[width]
                duration-300

                ${expanded
                    ? 'w-[300px]'
                    : 'w-[250px]'
                }
            `}
        >

            {statusEffectDamageAnimation && (
                <div
                    key={statusEffectDamageAnimation.eventId}
                    className={`
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-[70]

            whitespace-nowrap
            font-black
            text-xl
            drop-shadow-lg

            animate-[fight-damage-number_1000ms_linear_forwards]

            ${getStatusEffectDamageColor(
                        statusEffectDamageAnimation.effectId
                    )}
        `}
                >
                    -{statusEffectDamageAnimation.amount}
                </div>
            )}

            {resourceAnimation && (
                <div
                    key={resourceAnimation.eventId}
                    className={`
                        
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-[70]
            whitespace-nowrap
            font-black
            text-xl
            drop-shadow-lg

            animate-[fight-resource-number_900ms_linear_forwards]

            ${resourceAnimation.resource === 'hp'
                            ? 'text-green-500'
                            : 'text-blue-400'
                        }
        `}
                >
                    {resourceAnimation.increased ? '+' : '-'}
                    {resourceAnimation.amount}
                </div>
            )}

            {isTakingDamage && (
                <div
                    className={`
            pointer-events-none
            absolute
            bg-black/50
            left-1/2
            top-1/2
            z-[70]
            animate-[fight-damage-number_1000ms_linear_forwards]
            whitespace-nowrap
            font-black
            drop-shadow-lg

            ${animation.critical
                            ? 'text-2xl '
                            : 'text-xl '
                        }
            ${damageColorClass}
        `}
                >
                    -{animation.amount}
                </div>
            )}

            {/* Acción seleccionada */}
            {selectedAction && (
                <FightActionIndicator
                    fighter={fighter}
                    action={selectedAction}
                />
            )}

            {/* Efectos activos */}
            <FightActiveEffects
                fighter={fighter}
                fighters={fighters}
            />

            {/* Indicador de turno */}
            {isCurrentActor && (
                <div
                    className="
                        absolute
                        -top-7
                        right-0
                        z-30

                        animate-pulse

                        rounded
                        border
                        border-yellow-500/60
                        bg-slate-950

                        px-2
                        py-0.5

                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-yellow-300
                    "
                >
                    Turno
                </div>
            )}

            {/* Resultado visual del golpe */}
            {isDodging && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        z-[60]

                        -translate-x-1/2
                        -translate-y-1/2

                        whitespace-nowrap

                        text-sm
                        font-black
                        text-cyan-300
                        drop-shadow-lg
                    "
                >
                    ESQUIVADO
                </div>
            )}

            {isBlocking && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        z-[60]

                        -translate-x-1/2
                        -translate-y-1/2

                        whitespace-nowrap

                        text-sm
                        font-black
                        text-slate-200
                        drop-shadow-lg
                    "
                >
                    BLOQUEADO
                </div>
            )}

            {attackMissed && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        z-[60]

                        -translate-x-1/2
                        -translate-y-1/2

                        whitespace-nowrap

                        text-sm
                        font-black
                        text-slate-400
                        drop-shadow-lg
                    "
                >
                    MISS
                </div>
            )}

            {/* Card */}
            <div
                className={`
                    relative

                    rounded-lg
                    border
                    bg-slate-900
                    p-2
                    shadow-lg

                    transition-all
                    duration-300

                    ${fighter.alive
                        ? 'border-slate-700'
                        : 'border-red-950 opacity-60'
                    }

                    ${isCurrentActor
                        ? `
                                scale-[1.03]
                                border-yellow-400
                                ring-2
                                ring-yellow-400/40
                            `
                        : ''
                    }

                    ${isCurrentTarget
                        ? `
                                border-red-500
                                ring-2
                                ring-red-500/50
                                shadow-[0_0_20px_rgba(239,68,68,0.35)]
                            `
                        : ''
                    }

                    ${hitAnimationClass}
                    ${dodgeAnimationClass}
                    ${blockAnimationClass}
                `}
            >
                {expanded ? (
                    <ExpandedFighterCard
                        fighter={fighter}
                        hpPercent={hpPercent}
                        manaPercent={manaPercent}
                    />
                ) : (
                    <CompactFighterCard
                        fighter={fighter}
                        hpPercent={hpPercent}
                        manaPercent={manaPercent}
                    />
                )}

                {/* Expandir / Contraer */}
                <button
                    type="button"
                    onClick={() =>
                        setExpanded(prev => !prev)
                    }
                    className="
                        absolute
                        -bottom-2
                        left-1/2

                        flex
                        h-5
                        w-8
                        -translate-x-1/2
                        items-center
                        justify-center

                        rounded-full
                        border
                        border-slate-700
                        bg-slate-950

                        text-[10px]
                        text-slate-400

                        transition

                        hover:border-slate-500
                        hover:text-white
                    "
                    title={
                        expanded
                            ? 'Contraer'
                            : 'Expandir'
                    }
                >
                    {expanded ? '▲' : '▼'}
                </button>
            </div>
        </div>
    );
};