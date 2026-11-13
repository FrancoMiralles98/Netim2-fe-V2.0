import { useId, useState } from "react";
import type { CharacterSession, IdMissionsList, MissionListEntry, ReinosNames } from "netim2-shared";
import { MiniTooltip } from "../../../../shared/tooltip/components/MiniTooltip";
import { InventoryItemTooltip } from "../../../inventory/components/InventoryItemTooltip";
import { InventoryItemVisual } from "../../../inventory/components/InventoryItemVisual";
import { INVENTORY_SLOT_SIZE } from "../../../inventory/inventory.constants";
import { useCharacterMissions } from "../../hooks/useCharacterMissions";
import { getMissionObjectiveLabel } from "./mission-objective-label";
import "./mission-journal.css";

const filters = [
    { value: "all", label: "Todas" },
    { value: "main", label: "Principales" },
    { value: "side", label: "Secundarias" },
] as const;

type MissionFilter = typeof filters[number]["value"];

const formatExperienceReward = (amount: number, expNextLv: number): string => {
    if (expNextLv <= 0) return "—";

    const percentage = (amount / expNextLv) * 100;
    if (percentage > 100) return ">100%";
    if (percentage < 0.1) return "<0.1%";
    return `${Number(percentage.toFixed(1))}%`;
};

const kingdomAccent: Record<ReinosNames, string> = {
    shinsoo: "[--mission-accent:#d75a53]",
    jinno: "[--mission-accent:#5798d0]",
    chunjo: "[--mission-accent:#d7a744]",
};

const activeFilterColors: Record<ReinosNames, string> = {
    shinsoo: "border-red-200/60 [--filter-base:#230f12]",
    jinno: "border-sky-200/60 [--filter-base:#0c1721]",
    chunjo: "border-yellow-200/60 [--filter-base:#241c0d]",
};

const activeFilterSurface = [
    "bg-[var(--filter-base)]",
    "bg-[radial-gradient(ellipse_66%_80%_at_50%_108%,var(--mission-accent),transparent_85%),radial-gradient(ellipse_64%_65%_at_50%_-10%,color-mix(in_srgb,var(--mission-accent)_55%,transparent),transparent_90%)]",
    "text-[#fff4dc] [text-shadow:0_2px_3px_#000]",
    "shadow-[inset_0_0_0_1px_#ffffff2e,inset_0_0_6px_#0009,0_2px_3px_#000a]",
].join(" ");

const MissionIconPlaceholder = () => (
    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded border border-[#73654a] bg-black/60 text-xs text-stone-400">
        img
    </span>
);

const missionStatusLabels: Record<MissionListEntry["status"], string> = {
    available: "Disponible",
    in_progress: "En curso",
    ready_to_claim: "Por reclamar",
    failed: "Fallida",
    reward_claimed: "Reclamada",
};

const missionCategoryLabels: Record<MissionListEntry["category"], string> = {
    main: "Principal",
    side: "Secundaria",
    tutorial: "Tutorial",
};

const MissionStatusBadge = ({ status }: { status: MissionListEntry["status"] }) => (
    <span className="inline-block rounded-full border border-sky-300/35 bg-[#102a3a] px-2 py-0.5 text-xs text-sky-200">
        {missionStatusLabels[status]}
    </span>
);

const MissionDivider = () => (
    <img
        src="/utils/missions/hr-mission.png"
        alt=""
        className="mt-3 block h-3 w-full"
    />
);

interface MissionJournalProps {
    character: Pick<CharacterSession, "id" | "reino" | "exp_next_lv" | "lv" | "raza">;
}

const REWARD_SLOT_ROWS = 3;

export const MissionJournal = ({ character }: MissionJournalProps) => {
    const { id: characterId, reino, exp_next_lv: expNextLv } = character;
    const { state, retry, claim, isClaiming } = useCharacterMissions(characterId);
    const titleId = useId();
    const [filter, setFilter] = useState<MissionFilter>("all");
    const [selectedId, setSelectedId] = useState<IdMissionsList>();
    const palette = reino ?? "jinno";

    const missions = state.status === "ready" ? state.missions : [];
    const visibleMissions = missions.filter((mission) => filter === "all" || mission.category === filter);
    const selected = visibleMissions.find((mission) => mission.id === selectedId) ?? visibleMissions[0];
    const scrollObjectives = (selected?.steps.reduce((total, step) => total + step.objectives.length, 0) ?? 0) > 3;
    const objectiveProgress = new Map(selected?.progress?.objectivesProgress.map(({ objectiveId, count }) => [objectiveId, count]));
    const activeStepIndex = selected?.steps.findIndex((step) => step.id === selected.progress?.activeStepId) ?? -1;
    const itemRewards = selected?.rewards.filter((reward) => reward.type === "item") ?? [];

    return (
        <section
            aria-labelledby={titleId}
            aria-busy={state.status === "loading" || isClaiming}
            className={`relative aspect-[4/3] w-[1100px] justify-self-center bg-[length:100%_100%] bg-no-repeat px-16 pt-14 pb-12 text-[#f3e7cd] ${kingdomAccent[palette]}`}
            style={{ backgroundImage: reino ? `url('/game/modal-${reino}-rectangular.png')` : undefined }}
        >
            <header className="mb-6 flex items-center justify-center gap-3">
                <img src="/utils/missions/hr-row-mission-l.png" alt="" className="h-auto w-28" />
                <h2 id={titleId} className="font-metin text-center text-3xl font-semibold uppercase text-[#f5d28a] [text-shadow:0_2px_3px_#000]">
                    Diario de misiones
                </h2>
                <img src="/utils/missions/hr-row-mission-r.png" alt="" className="h-auto w-28" />
            </header>

            <div className="grid grid-cols-[minmax(0,38fr)_minmax(0,62fr)] items-start gap-4">
                <aside aria-label="Lista de misiones" className="flex flex-col self-stretch">
                    <div role="group" aria-label="Filtrar misiones" className="mb-2 flex flex-wrap gap-1.5">
                        {filters.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={filter === value}
                                onClick={() => {
                                    setFilter(value);
                                    if (selected && value !== "all" && selected.category !== value) {
                                        setSelectedId(undefined);
                                    }
                                }}
                                className={`flex-1 cursor-pointer rounded-t-md border px-2 py-1.5 font-serif text-sm ${filter === value
                                    ? `${activeFilterSurface} ${activeFilterColors[palette]}`
                                    : "border-stone-500/60 bg-linear-to-b from-[#232528] to-[#0b0c0d] hover:border-[#bfa06a]"}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="relative isolate aspect-[500/678] grow p-3">
                        <span aria-hidden="true" className="mission-list-panel-frame" />
                        {state.status === "error" && (
                            <div role="alert" className="text-sm">
                                <p>No se pudieron obtener las misiones.</p>
                                <button type="button" onClick={retry} className="mt-2 cursor-pointer text-amber-200 underline">Reintentar</button>
                            </div>
                        )}
                        {state.status === "ready" && visibleMissions.length === 0 && (
                            <p className="text-sm">
                                {missions.length === 0 ? "No tenés misiones en progreso." : "No hay misiones en esta categoría."}
                            </p>
                        )}
                        {visibleMissions.length > 0 && (
                            <ul className="space-y-1.5">
                                {visibleMissions.map((mission) => {
                                    const isSelected = selected?.id === mission.id;
                                    return (
                                        <li key={mission.id}>
                                            <button
                                                type="button"
                                                aria-pressed={isSelected}
                                                onClick={() => setSelectedId(mission.id)}
                                                className={`mission-card flex w-full cursor-pointer items-center gap-2 rounded border p-2 text-left ${isSelected
                                                    ? "mission-card-glow"
                                                    : "mission-card-idle border-stone-500/50 bg-linear-to-br from-[#1c1d1e] to-[#101112]"}`}
                                            >
                                                <MissionIconPlaceholder />
                                                <span className="min-w-0 space-y-1">
                                                    <span className="block font-serif text-sm font-semibold sm:text-base">{mission.name}</span>
                                                    <MissionStatusBadge status={mission.status} />
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </aside>

                {selected && (
                    <article className="mission-detail relative isolate flex aspect-[426/400] min-w-0 flex-col bg-[url('/utils/missions/fondo-mision.png')] bg-[length:100%_100%] bg-no-repeat px-6 pt-5 pb-6">
                        <h3 className="font-serif text-2xl font-semibold text-[#f5d28a]">{selected.name}</h3>
                        <div className="mt-5 mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-[#a18147]/60 bg-[#352817] px-2 py-0.5 text-xs text-[#f3d08b]">
                                {missionCategoryLabels[selected.category]}
                            </span>
                            <MissionStatusBadge status={selected.status} />
                            <span className="ml-auto text-xs capitalize text-stone-300">{selected.owner.replaceAll("_", " ")}</span>
                        </div>
                        <p key={selected.id} className="custom-scrollbar max-h-28 overflow-y-auto whitespace-pre-line pr-2 text-sm leading-relaxed [text-shadow:0_1px_3px_#000]" tabIndex={0}>
                            {selected.description}
                        </p>

                        <MissionDivider />
                        <h4 className="my-1.5 font-serif text-lg font-semibold text-[#f5d28a]"><span aria-hidden="true" className="mr-2 text-sm">◇</span>Objetivos</h4>
                        <div
                            key={selected.id}
                            role={scrollObjectives ? "region" : undefined}
                            aria-label={scrollObjectives ? "Lista de objetivos" : undefined}
                            tabIndex={scrollObjectives ? 0 : undefined}
                            className={scrollObjectives ? "custom-scrollbar max-h-[11.625rem] overflow-y-auto pr-2" : undefined}
                        >
                            {selected.steps.map((step, index) => {
                                const locked = selected.sequentialSteps && activeStepIndex >= 0 && index > activeStepIndex;
                                return (
                                    <div key={step.id} className="mb-2">
                                        {selected.steps.length > 1 && (
                                            <p className="mb-1 text-xs text-stone-300">Paso {index + 1}{locked ? " · Bloqueado" : ""}</p>
                                        )}
                                        <ul className={`space-y-1.5 ${locked ? "opacity-60" : ""}`}>
                                            {step.objectives.map((objective) => {
                                                const label = getMissionObjectiveLabel(objective);
                                                const progress = Math.min(objectiveProgress.get(objective.id) ?? 0, objective.quantity);
                                                const completed = progress >= objective.quantity;
                                                return (
                                                    <li key={objective.id} className="flex items-center gap-2 rounded-md border border-stone-500/50 bg-[#191a1b] p-1.5">
                                                        <MissionIconPlaceholder />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-serif text-sm font-semibold">{label}</p>
                                                            {objective.type === "collect" && objective.mode === "inventory" && objective.consumeOnClaim && (
                                                                <p className="text-xs italic text-stone-300">Se consume al reclamar</p>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <progress
                                                                    aria-label={label}
                                                                    className="mission-progress h-2 min-w-0 flex-1 appearance-none overflow-hidden rounded-full border border-[#655a47] bg-black/75"
                                                                    value={progress}
                                                                    max={objective.quantity}
                                                                />
                                                                <span className="shrink-0 text-xs tabular-nums">{progress}/{objective.quantity}</span>
                                                                {completed && <span className="text-emerald-300" aria-label="Completado">✓</span>}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                        {selected.note && <p className="mt-2 text-xs italic text-stone-300">{selected.note}</p>}

                        <div className="mt-auto">
                            <MissionDivider />
                            <div className="my-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                                <h4 className="font-serif text-lg font-semibold text-[#f5d28a]"><span aria-hidden="true" className="mr-2 text-sm">◇</span>Recompensas</h4>
                                <ul className="flex flex-wrap items-center gap-4 text-sm tabular-nums">
                                    {selected.rewards.map((reward, index) => {
                                        if (reward.type === "exp") {
                                            return (
                                                <li key={index} className="flex items-center">
                                                    <MiniTooltip
                                                        text={`Experiencia a recibir: ${reward.amount.toLocaleString("es-AR")}`}
                                                        className="items-center gap-1.5"
                                                    >
                                                        <img src="/utils/exp-icon.png" alt="EXP" className="size-4 shrink-0 object-contain" />
                                                        <span>{formatExperienceReward(reward.amount, expNextLv)}</span>
                                                    </MiniTooltip>
                                                </li>
                                            );
                                        }
                                        if (reward.type === "yang") {
                                            return (
                                                <li key={index} className="flex items-center gap-1.5">
                                                    <img src="/utils/yang-icon.png" alt="Yang" className="size-4 shrink-0 object-contain" />
                                                    <span>{reward.amount.toLocaleString("es-AR")}</span>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                            {itemRewards.length > 0 && (
                                <ul key={selected.id} className="mt-2 flex flex-wrap gap-3 text-sm">
                                    {itemRewards.map(({ item }, index) => (
                                        <li
                                            key={index}
                                            className="shrink-0 bg-[url('/game/inventory/bg_item.png')] bg-repeat"
                                            style={{
                                                width: item.size.cols * INVENTORY_SLOT_SIZE,
                                                height: REWARD_SLOT_ROWS * INVENTORY_SLOT_SIZE,
                                            }}
                                        >
                                            <InventoryItemTooltip item={item} character={character}>
                                                <div style={{ height: Math.min(item.size.rows, REWARD_SLOT_ROWS) * INVENTORY_SLOT_SIZE }}>
                                                    <InventoryItemVisual item={item} />
                                                </div>
                                            </InventoryItemTooltip>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {selected.status === "ready_to_claim" && selected.progress?.attemptId && (
                                <div className="mt-4 flex justify-center">
                                    <button
                                        type="button"
                                        disabled={isClaiming}
                                        onClick={() => void claim(selected)}
                                        className="inline-flex cursor-pointer items-center gap-3 rounded-md border-4 border-double border-[#b88b45] bg-linear-to-b from-[#4d3517] via-[#2a1b0d] to-[#171008] px-6 py-1.5 font-metin font-semibold text-[#ffe4a8] shadow-[inset_0_0_8px_#e9b25442,0_2px_5px_#000b] [text-shadow:0_1px_3px_#000] hover:border-[#f6d58e] hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-wait disabled:opacity-60"
                                    >
                                        <span aria-hidden="true" className="text-xs text-[#c69a50]">◆</span>
                                        Reclamar
                                        <span aria-hidden="true" className="text-xs text-[#c69a50]">◆</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </article>
                )}
            </div>
        </section>
    );
};
