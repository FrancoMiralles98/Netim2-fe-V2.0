import type { FightEvent } from "netim2-shared";

export const EXPLICIT_EVENTS: FightEvent[] = [
    {
        type: 'turn_started',
        actorId: 'guerrero-id1',
        eventId: 'dwanjdwa',
        fightId: 'fight-id',
        turnNumber: 1
    },
    {
        type: 'cooldown_updated',
        eventId: 'donwam123',
        fighterId: 'guerrero-id1',
        fightId: 'fight-id',
        previousRemainingTurns: 10,
        remainingTurns: 9,
        skillId: 17,
        turnNumber: 1
    },
    {
        type: 'resource_changed',
        amount: 100,
        previousValue: 1000,
        currentValue: 1100,
        eventId: 'rotmgsr',
        fighterId: 'guerrero-id1',
        fightId: 'fight-id',
        reason: 'hp_regeneration',
        resource: 'hp',
        turnNumber: 1
    },
    {
        type: 'resource_changed',
        amount: 50,
        previousValue: 450,
        currentValue: 500,
        eventId: 'dwgg42123',
        fighterId: 'guerrero-id1',
        fightId: 'fight-id',
        reason: 'mana_regeneration',
        resource: 'mana',
        turnNumber: 1
    },
    {
        type: 'status_effect_ticked',
        appliedDamage: 50,
        effectId: 'electrico',
        effectInstanceId: 'electrico-insta',
        eventId: '1om3r',
        fightId: 'fight-id',
        remainingTurns: 9,
        sourceFighterId: 'mob-id',
        targetCurrentHp: 1050,
        targetFighterId: 'guerrero-id1',
        tickNumber: 1,
        turnNumber: 1
    },
    {
        type: 'status_effect_stack_proc',
        appliedDamage: 150,
        currentStacks: 1,
        effectId: 'electrico',
        effectInstanceId: 'electrico-insta',
        eventId: 'om13413',
        fightId: 'fight-id',
        sourceFighterId: 'mob-id',
        targetCurrentHp: 900,
        targetFighterId: 'guerrero-id1',
        turnNumber: 1
    },
    {
        type: 'action_selected',
        turnNumber: 1,
        action: { type: 'basic_attack', targetId: 'mob-id' },
        actorId: 'guerrero-id1',
        eventId: 'dwmlafa',
        fightId: 'fight-id',
    },
    {
        type: 'hit_resolved',
        attackerId: 'guerrero-id1',
        eventId: 'do123no',
        fightId: 'fight-id',
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
        fightId: 'fight-id',
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
        turnNumber: 1,
        targetDefeated: false,
        targetFighterId: 'mob-id',
        componentIndex: 0,
        hitIndex: 0,
    },
    {
        type: 'turn_ended',
        actorAlive: true,
        actorCurrentHp: 900,
        actorCurrentMana: 500,
        actorId: 'guerrero-id1',
        eventId: 'dwakmfawd9801230',
        fightId: 'fight-id',
        turnNumber: 1
    }
]