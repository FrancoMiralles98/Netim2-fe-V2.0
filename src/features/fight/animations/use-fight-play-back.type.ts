import type { FightPlaybackPayload, FightResult } from "netim2-shared";
import type { FightFighterState } from "../card/fighter-state";

export interface UseFightPlayBackProps {
    initialFighters: FightFighterState[];
    events?: FightPlaybackPayload;
    result?: FightResult;
}

export type FightPlaybackSpeed =
    | 0.5
    | 1
    | 2
    | 3;
