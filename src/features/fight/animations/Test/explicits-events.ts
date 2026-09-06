import type { FightEvent } from "netim2-shared";

export const EXPLICIT_EVENTS: FightEvent[] = [
    {
        type: 'damage_resolved',
        critical: false,
        eventId: 'dwakdaf',
        fightId: 'fight-id',
        penetrating: false,
        resolution: {
            appliedDamage: 100,
            damageType: 'ad',
            delivery: 'direct'
        },
        source: {type: 'basic_attack',sourceFighterId:'guerrero-id'},
        targetCurrentHp: 1000,
        targetDefeated: false,
        targetFighterId: 'mob-id',
        targetPreviousHp: 1100,
        turnNumber: 1,
        componentIndex: 1,
    }
];