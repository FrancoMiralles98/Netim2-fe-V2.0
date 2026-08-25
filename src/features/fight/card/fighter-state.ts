import type { UNIQUE_ID_SKILLS } from "netim2-shared/dist/skills/props/unique-id-skill.enum";
import type { FighterSide } from "../initiative/InitiativeModal";
import type { ActiveStatusEffectId, BonusRefKeys } from "netim2-shared";

export interface FightFighterState {
    fighterId: string;
    name: string;
    side: FighterSide;

    alive: boolean;

    skills: FightSkillDisplay[]

    resources: {
        hp: {
            current: number;
            max: number;
        };

        mana: {
            current: number;
            max: number;
        };
    };

    cooldowns: FightSkillCooldown[];

    activeEffects: FightStatusEffectState[];
    activeAuras: FightAuraState[];
    activeBuffs: FightBuffState[];
    statModifiers: FightStatModifierDisplay[];
}

export interface FightSkillCooldown {
    skillId: UNIQUE_ID_SKILLS;
    initialTurns: number;
    remainingTurns: number;
}

export interface FightStatusEffectState {
    instanceId: string;

    effectId: ActiveStatusEffectId; //Esto se sca del backend

    sourceFighterId: string;

    remainingTurns: number;

    damage?: number;

    stacks?: { current: number, toApplyExtraDamage: number };
}

export interface FightAuraState {
    instanceId: string;
    auraId: UNIQUE_ID_SKILLS;
    name: string;
    sourceFighterId: string;
    remainingTurns?: number;
}

export interface FightBuffState {
    instanceId: string;
    buffId: string;
    name: string;
    sourceFighterId: string;
    remainingTurns?: number;
}

export interface FightStatModifierDisplay {
    stat: BonusRefKeys; //del backend
    operation: 'increased'; //del backend
    value: number;
}

export interface FightSkillDisplay {
    skillId: UNIQUE_ID_SKILLS;
    name: string;
    icon: string;
}

export interface FighterCardContentProps {
    fighter: FightFighterState,
    hpPercent: number,
    manaPercent: number
}