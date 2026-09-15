import { useState } from "react";
import {
    FightResult,
    type FighterFightSummary
} from "../fightResult/FightResult";
import { FightTest } from "./FightTest";

export type FightViewPhase = 'fight' | 'result';

type FightViewState =
    | {
        phase: 'fight';
    }
    | {
        phase: 'result';
        fightSummary: FighterFightSummary[];
    };

export const FightView = () => {
    const [view, setView] =
        useState<FightViewState>({
            phase: 'fight'
        });

    const handleFinishFight = (
        summary: FighterFightSummary[]
    ): void => {
        setView({
            phase: 'result',
            fightSummary: summary
        });
    };

    if (view.phase === 'result') {
        return (
            <FightResult
                summaries={view.fightSummary}
            />
        );
    }

    return (
        <FightTest
            onFinishFight={handleFinishFight}
        />
    );
};
