import type { ActiveStatusEffectId, InitialFighterStats, UNIQUE_ID_SKILLS } from "netim2-shared";
import type { FightAuraState, FightBuffState, FightFighterState, FightStatusEffectState } from "../card/fighter-state";

export const mapInitialFighterToState = (
    fighter: InitialFighterStats
): FightFighterState => ({
    fighterId: fighter.fighterId,

    name: fighter.name,

    side: fighter.side,

    /*
     * InitialFighterStats actualmente
     * no contiene el icon del fighter.
     */
    icon: '',

    alive: fighter.alive,

    skills: fighter.skills.map(skill => ({
        skillId: skill.skillId,
        name: skill.name,
        icon: skill.icon
    })),

    resources: {
        hp: {
            current: fighter.resource.hp.current,
            max: fighter.resource.hp.max
        },

        mana: {
            current: fighter.resource.mana.current,
            max: fighter.resource.mana.max
        }
    },

    cooldowns: [],

    activeEffects: new Map<
        ActiveStatusEffectId,
        FightStatusEffectState
    >(),

    activeAuras: new Map<
        UNIQUE_ID_SKILLS,
        FightAuraState
    >(),

    activeBuffs: new Map<
        UNIQUE_ID_SKILLS,
        FightBuffState
    >(),

    statModifiers: []
});

export const mapInitialFightersToState = (
    fighters: InitialFighterStats[]
): FightFighterState[] => {
    return fighters.map(
        mapInitialFighterToState
    );
};