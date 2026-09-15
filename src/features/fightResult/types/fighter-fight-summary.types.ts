import type {
    FighterCombatStatisticsState,
    FightSide
} from "netim2-shared";

export interface FighterFightSummary {
    fighterId: string;
    name: string;
    side: FightSide;
    alive: boolean;
    resources: {
        hp: number;
        mana: number;
    };
    statistics: FighterCombatStatisticsState;
}
