import { useState } from "react";
import { FightAuraEffects } from "./components/FightAuraEffects";
import { FightActiveEffects } from "./components/icons/FightActiveEffects";
import type { FightFighterState } from "./fighter-state";
import { ExpandedFighterCard } from "./ExpandedFighterCard";
import { CompactFighterCard } from "./CompactFighterCard";
import type { CombatAction } from "netim2-shared";
import { FightActionIndicator } from "../animations/components/FightActionIndicator";
import type { FightAnimationState, HitVisual } from "../animations/animations.types";
import { HitVisualLayer } from "./components/HitVisualLayer";
import { getFighterAnimationVisualState, getFighterCardAnimationClass } from "../utils/get-visual-animation.helper";
import { CombatFloatingValue } from "./components/CombatFloatingValue";
import type { FightPlaybackSpeed } from "../animations/use-fight-play-back.type";

export interface FightFighterCardProps {
    fighter: FightFighterState;
    fighters: FightFighterState[];

    isCurrentActor?: boolean;
    isCurrentTarget?: boolean;

    selectedAction?: CombatAction;

    animation?: FightAnimationState;
    hitVisuals?: HitVisual[];
    message?: string;
    speed: FightPlaybackSpeed
    paused?: boolean;
}

export const FightFighterCard = ({
    fighter,
    fighters,
    isCurrentActor = false,
    isCurrentTarget = false,
    selectedAction,
    animation,
    hitVisuals = [],
    message,
    speed,
    paused = false,
}: FightFighterCardProps) => {

    const [expanded, setExpanded] = useState(false);

    const animationVariables = {
        '--fight-damage-duration':
            `${1000 / speed}ms`,

        '--fight-resource-duration':
            `${1000 / speed}ms`,

        '--fight-hit-duration':
            `${400 / speed}ms`,

        '--fight-dodge-duration':
            `${500 / speed}ms`,

        '--fight-block-duration':
            `${500 / speed}ms`,

        '--fight-stun-duration':
            `${900 / speed}ms`
    } as React.CSSProperties;

    const animationState =
        getFighterAnimationVisualState(
            animation,
            fighter.fighterId
        );

    const cardAnimationClass =
        getFighterCardAnimationClass(
            animationState,
            fighter.side
        );

    const {
        isDodging,
        isBlocking,
        isMissed,
        isStunned,
        floatingAnimation,
    } = animationState;

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
            data-fight-fighter-id={fighter.fighterId}
            style={animationVariables}
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

            <FightAuraEffects fighter={fighter} paused={paused} speed={speed} />
            <HitVisualLayer visuals={hitVisuals} fighterId={fighter.fighterId} paused={paused} speed={speed} />

            {message && (
                <div
                    className="
              pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-[70]

            whitespace-nowrap
            font-black
            text-xl
            drop-shadow-lg
            text-violet-200
            animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]
        "
                >
                    {message}
                </div>
            )}

            {floatingAnimation && (
                <CombatFloatingValue
                    key={floatingAnimation.id}
                    animation={floatingAnimation}
                    paused={paused}
                />
            )}



            {isStunned && (
                <div
                    className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-[70]

            whitespace-nowrap
            font-black
            text-xl
            text-violet-200
            drop-shadow-lg

            animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]
        "
                >
                    STUNNED
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
            z-[70]

            whitespace-nowrap
            font-black
            text-lg
            drop-shadow-lg
            text-slate-200
            animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]
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
            z-[70]

            whitespace-nowrap
            font-black
            text-lg
            drop-shadow-lg
            text-slate-200
            animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]
        "
                >
                    BLOQUEADO
                </div>
            )}

            {isMissed && (
                <div
                    className="
              pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-[70]

            whitespace-nowrap
            font-black
            text-lg
            drop-shadow-lg
            text-slate-200
            animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]
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

                    ${cardAnimationClass}
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
