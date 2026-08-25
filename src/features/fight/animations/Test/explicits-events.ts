import type { FightEvent } from "netim2-shared";

export const EXPLICIT_EVENTS: FightEvent[] = [
    {
        type: 'turn_started',
        actorId: 'guerrero-id1',
        eventId: 'dwanjdwa',
        fightId: 'dmwladmlwa',
        turnNumber: 1
    },
    {
        type: 'action_selected',
        turnNumber: 1,
        action: { type: 'basic_attack', targetId: 'mob-id' },
        actorId: 'guerrero-id1',
        eventId: 'dwmlafa',
        fightId: 'dmwladmlwa',
    },
    {
        type: 'hit_resolved',
        attackerId: 'guerrero-id1',
        eventId: 'do123no',
        fightId: 'dmwladmlwa',
        hitIndex: 0,
        resolution: { critical: false, doble_trigged: false, penetrating: false, result: 'hit' },
        source: { type: 'basic_attack' },
        targetId: 'mob-id',
        turnNumber: 1
    },
    {
        type: 'damage_resolved',
        critical: false,
        eventId: 'dwaomn123124',
        fightId: 'dmwladmlwa',
        penetrating: false,
        resolution: {
            appliedDamage: 300,
            damageType: 'ad',
            delivery: 'direct',
            finalDamage: 300,
            mitigatedByBlock: 0,
            mitigatedByDefense: 0,
            mitigatedByResistance: 0,
            modifiedDamage: 0,
            overkillDamage: 0,
            rawDamage: 300,
            totalMitigated: 0
        },
        source: { type: 'basic_attack', sourceFighterId: 'guerrero-id1', },
        targetPreviousHp: 1500,
        targetCurrentHp: 1200,
        turnNumber:1,
        targetDefeated: false,
        targetFighterId: 'mob-id',
        componentIndex: 0,
        hitIndex: 0,
    }
]