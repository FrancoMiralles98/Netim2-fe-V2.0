import type { CombatAction, DamageType } from "netim2-shared";

export interface FightPlaybackState {
    currentTurn: number;

    currentActorId?: string;
    currentTargetId?: string;

    currentAction?: CombatAction;

    animation?: FightAnimationState;

    hitSequence?: {
        current: number;
        total: number;
    };

    message?: string;
}

export type FightAnimationState =
    | {
        type: 'basic_attack';
        attackerId: string;
        targetId: string;
    }
    | {
        type: 'hit';
        attackerId: string;
        targetId: string;
        hitIndex: number;
        critical: boolean;
        penetrating: boolean;
    }
    | {
        type: 'missed';
        attackerId: string;
        targetId: string;
        hitIndex: number;
    }
    | {
        type: 'dodged';
        attackerId: string;
        targetId: string;
        hitIndex: number;
    }
    | {
        type: 'blocked';
        attackerId: string;
        targetId: string;
        hitIndex: number;
    }
    | {
        type: 'damage';
        targetId: string;
        amount: number;
        damageType: DamageType;
        critical: boolean;
    };