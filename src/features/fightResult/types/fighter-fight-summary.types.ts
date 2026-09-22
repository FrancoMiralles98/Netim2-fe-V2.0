import type {
    FighterCombatStatisticsState,
    FightSide,
    InitialFighterStats
} from "netim2-shared";

export type FighterFightSummarySkill =
    InitialFighterStats['skills'][number];

export interface FighterFightSummary {
    fighterId: string;
    name: string;
    side: FightSide;
    alive: boolean;
    skills: FighterFightSummarySkill[];
    resources: {
        hp: number;
        mana: number;
    };
    statistics: FighterCombatStatisticsState;
}
