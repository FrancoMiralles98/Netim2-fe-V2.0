import { useRef, useState } from "react";
import type { FightResponse } from "netim2-shared";
import { fightLabRequest } from "./api/fight.services";
import { FightPlayback } from "./FightPlayback";
import { useModal } from "../../shared/modal/hooks/useModal";
import type { FighterFightSummary } from "../fightResult/types/fighter-fight-summary.types";

export const FightTest = ({ onFinishFight }: { onFinishFight: (summary: FighterFightSummary[]) => void }) => {
    const [response, setResponse] = useState<FightResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const pending = useRef(false);
    const modal = useModal();

    const loadFight = async () => {
        if (pending.current) return;
        pending.current = true;
        setLoading(true);
        try {
            setResponse(await fightLabRequest());
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            pending.current = false;
            setLoading(false);
        }
    };

    return (
        <>
            <button type="button" disabled={loading} onClick={() => void loadFight()} className="m-4 rounded bg-slate-700 px-3 py-1 text-white disabled:opacity-40">
                {loading ? "Cargando pelea…" : "Abrir pelea de prueba"}
            </button>
            {response && <FightPlayback key={response.fightPlaybackPayload.fightId} response={response} onFinishFight={onFinishFight} />}
        </>
    );
};
