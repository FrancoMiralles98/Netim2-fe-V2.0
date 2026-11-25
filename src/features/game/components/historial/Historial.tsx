import { useId, useState } from "react";
import type { CharacterSession } from "netim2-shared";
import { useCharacterHistory } from "../../hooks/useCharacterHistory";
import { HistoryEntry } from "./HistoryEntry";
import "./historial.css";

const filters = [
    { value: "all", label: "Todos" },
    { value: "pvm", label: "PVM" },
    { value: "pvp", label: "PVP" },
] as const;

interface HistorialProps {
    character: Pick<CharacterSession, "id" | "reino">;
    onDetail: (historialId: string) => void;
}

export const Historial = ({ character, onDetail }: HistorialProps) => {
    const titleId = useId();
    const { state, retry } = useCharacterHistory(character.id);
    const [filter, setFilter] = useState<typeof filters[number]["value"]>("all");
    const [onlyPending, setOnlyPending] = useState(false);
    const entries = state.status === "ready" ? state.entries : [];
    const filtered = entries.filter(entry =>
        (filter === "all" || entry.filtro === filter) && (!onlyPending || entry.remainingReward));

    return (
        <section
            aria-labelledby={titleId}
            aria-busy={state.status === "loading"}
            data-kingdom={character.reino ?? "jinno"}
            className="history-panel relative flex h-[825px] w-[1100px] flex-col bg-[length:100%_100%] bg-no-repeat px-12 pt-12 pb-20 text-[#f6edd8]"
            style={{ backgroundImage: character.reino ? `url('/game/modal-${character.reino}-rectangular.png')` : undefined }}
        >
            <header className="shrink-0 text-center">
                <h2 id={titleId} className="font-metin mt-3 text-[38px] font-semibold leading-tight text-[#ffe3a1]">Historial de batallas</h2>
                <div className="mt-2 flex items-center justify-center gap-3 text-lg text-[#a9cde5]">
                </div>
            </header>
            <div className="mt-6 flex shrink-0 items-end justify-between border-b border-[#a7b9c1]/70">
                <div role="group" aria-label="Tipo de combate" className="flex gap-1">
                    {filters.map(({ value, label }) => (
                        <button key={value} type="button" aria-pressed={filter === value} onClick={() => {
                            setFilter(value);
                        }} className="history-button history-tab font-metin">{label}</button>
                    ))}
                </div>
                <ul aria-label="Referencia de resultados" className="mb-3 flex items-center gap-4 text-sm">
                    <li className="history-legend flex items-center gap-2" data-outcome="defeat"><span aria-hidden="true" className="history-legend__stripe" />Derrota</li>
                    <li className="history-legend flex items-center gap-2" data-outcome="victory"><span aria-hidden="true" className="history-legend__stripe" />Victoria</li>
                    <li className="history-legend flex items-center gap-2" data-outcome="draw"><span aria-hidden="true" className="history-legend__stripe" />Empate</li>
                </ul>
                <label className="mb-3 flex cursor-pointer items-center gap-2 text-base">
                    <input type="checkbox" checked={onlyPending} onChange={event => {
                        setOnlyPending(event.target.checked);
                    }} className="size-4 accent-amber-300" />
                    Con pendientes
                </label>
            </div>
            <div key={`${filter}-${onlyPending}`} className="custom-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto p-0.5">
                {state.status === "loading" && <p role="status" className="py-12 text-center text-[#a9cde5]">Cargando combates…</p>}
                {state.status === "error" && (
                    <div role="alert" className="py-12 text-center">
                        <p>No se pudo obtener el historial.</p>
                        <button type="button" onClick={retry} className="history-button mt-4 px-4 py-2">Reintentar</button>
                    </div>
                )}
                {state.status === "ready" && filtered.length === 0 && (
                    <p className="py-12 text-center text-[#a9cde5]">
                        {entries.length === 0 ? "Todavía no tenés combates en el historial." : "No hay combates con estos filtros."}
                    </p>
                )}
                <ul className="flex flex-col gap-3">
                    {filtered.map(entry => (
                        <HistoryEntry key={entry.id} entry={entry} onDetail={() => onDetail(entry.id)} />
                    ))}
                </ul>
            </div>
        </section>
    );
};
