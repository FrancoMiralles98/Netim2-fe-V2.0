import { useState } from "react";
import {
    FightResult,
    type FighterFightSummary
} from "../fightResult/FightResult";
import { FightTest } from "./FightTest";
import type { CharacterFightResultResponse } from "netim2-shared";
import { FightPlayback } from "./FightPlayback";

export type FightViewPhase = 'fight' | 'result';

type FightViewState =
    | {
        phase: 'fight';
    }
    | {
        phase: 'result';
        fightSummary: FighterFightSummary[];
    };

export const FightView = ({ response, onBack }: { response?: CharacterFightResultResponse; onBack?: () => void }) => {
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
            <>
                {onBack && (
                    <button type="button" onClick={onBack} className="m-4 cursor-pointer rounded border border-amber-600 bg-stone-900 px-4 py-2 text-amber-100">
                        Volver a la zona
                    </button>
                )}
                <FightResult summaries={view.fightSummary} response={response} />
            </>
        );
    }

    if (response) {
        return <FightPlayback response={response} onFinishFight={handleFinishFight} />;
    }

    return (
        <FightTest
            onFinishFight={handleFinishFight}
        />
    );
};
