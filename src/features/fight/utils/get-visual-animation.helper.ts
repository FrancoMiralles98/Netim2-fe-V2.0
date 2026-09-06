import type { FightAnimationState } from "../animations/animations.types";
import type { CombatFloatingAnimation } from "../card/components/CombatFloatingValue";
import type { FightFighterState } from "../card/fighter-state";

export interface FighterAnimationVisualState {
    isHit: boolean;
    isCriticalHit: boolean;

    isDodging: boolean;
    isBlocking: boolean;
    isMissed: boolean;

    isStunned: boolean;

    floatingAnimation?: CombatFloatingAnimation;
}

export const getFighterAnimationVisualState = (
    animation: FightAnimationState | undefined,
    fighterId: string
): FighterAnimationVisualState => {

    const state: FighterAnimationVisualState = {
        isHit: false,
        isCriticalHit: false,

        isDodging: false,
        isBlocking: false,
        isMissed: false,

        isStunned: false,

        floatingAnimation: undefined,
    };

    if (!animation) {
        return state;
    }

    switch (animation.type) {

        case 'hit':

            if (animation.targetId === fighterId) {
                state.isHit = true;
                state.isCriticalHit = animation.critical;
            }

            break;

        case 'dodged':

            if (animation.targetId === fighterId) {
                state.isDodging = true;
            }

            break;

        case 'blocked':

            if (animation.targetId === fighterId) {
                state.isBlocking = true;
            }

            break;

        case 'missed':

            if (animation.targetId === fighterId) {
                state.isMissed = true;
            }

            break;

        case 'stunned':

            if (animation.fighterId === fighterId) {
                state.isStunned = true;
            }

            break;

        case 'damage':
        case 'healing':
        case 'status_effect_damage':

            if (animation.targetId === fighterId) {
                state.floatingAnimation = animation;
            }

            break;

        case 'resource_changed':

            if (animation.fighterId === fighterId) {
                state.floatingAnimation = animation;
            }

            break;
    }

    return state;
};

export const getFighterCardAnimationClass = (
    state: FighterAnimationVisualState,
    side: FightFighterState['side']
): string => {

    const classes: string[] = [];

    if (state.isHit) {
        classes.push(
            state.isCriticalHit
                ? 'animate-[fight-critical-hit_450ms_ease-out]'
                : 'animate-[fight-hit_350ms_ease-out]'
        );
    }

    if (state.isStunned) {
        classes.push(
            'animate-[fight-stunned_700ms_ease-in-out]'
        );
    }

    if (state.isDodging) {
        classes.push(
            side === 'allies'
                ? 'animate-[fight-dodge-left_450ms_ease-out]'
                : 'animate-[fight-dodge-right_450ms_ease-out]'
        );
    }

    if (state.isBlocking) {
        classes.push(
            'animate-[fight-block_400ms_ease-out]'
        );
    }

    return classes.join(' ');
};