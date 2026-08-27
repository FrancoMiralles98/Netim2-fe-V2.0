import { UNIQUE_ID_SKILLS } from "netim2-shared/dist/skills/props/unique-id-skill.enum";
import type { FightFighterState } from "../../card/fighter-state";

export const GuereroState: FightFighterState = {
    fighterId: 'guerrero-id1',
    name: 'Guerrero1',
    side: 'allies',

    alive: true,

    skills: [
        {
            skillId: UNIQUE_ID_SKILLS.EMBOSCADA,
            name: 'Emboscada',
            icon: '/characterSelection/Daga.png'
        },
        {
            skillId: UNIQUE_ID_SKILLS.ROCIADA,
            name: 'Rociada',
            icon: '/characterSelection/Daga.png'
        }
    ],

    resources: {
        hp: {
            current: 1000,
            max: 1500
        },

        mana: {
            current: 450,
            max: 500
        }
    },

    /*
     * Al comienzo ninguna skill está en cooldown.
     */
    cooldowns: [{ initialTurns: 10, remainingTurns: 10, skillId: 17 }],

    /*
     * Si el fighter comienza la pelea sin efectos,
     * buffs o auras, todos empiezan vacíos.
     */
    activeEffects: [{
        effectId: 'electrico',
        instanceId: 'electrico-insta',
        remainingTurns: 9,
        sourceFighterId: 'mob-id',
        damage: 50,
        stacks: { current: 3, toApplyExtraDamage: 3 }
    }
    ],
    activeAuras: [],
    activeBuffs: [],

    /*
     * Modificadores visuales activos al inicio.
     */
    statModifiers: []
};

export const MobState: FightFighterState = {
    fighterId: 'mob-id',
    name: 'Perro Salvaje',
    side: 'enemies',

    alive: true,

    skills: [],

    resources: {
        hp: {
            current: 1500,
            max: 1500
        },

        mana: {
            current: 500,
            max: 500
        }
    },

    /*
     * Al comienzo ninguna skill está en cooldown.
     */
    cooldowns: [],

    /*
     * Si el fighter comienza la pelea sin efectos,
     * buffs o auras, todos empiezan vacíos.
     */
    activeEffects: [],
    activeAuras: [],
    activeBuffs: [],

    /*
     * Modificadores visuales activos al inicio.
     */
    statModifiers: []
};
