import { useEffect, useId, useRef, useState } from "react";
import type { GetMobInfoResponse, MobSummary } from "netim2-shared";
import { getMobImagePath } from "../../shared/images/getMobImagePath";
import { getMobInfoRequest } from "./api/explore.services";
import { MobGeneralStatsPanel } from "./MobGeneralStatsPanel";
import { MobBonusPanel } from "./MobBonusPanel";
import { MobDropsPanel } from "./MobDropsPanel";
import { FightQuantityModal } from "./FightQuantityModal";
import "./mob-info-modal.css";

interface MobInfoModalProps {
    mob: MobSummary;
    onClose: () => void;
    onFight: (quantity: number) => void;
    isStartingFight: boolean;
}

type MobInfoState =
    | { status: "loading" | "error" }
    | { status: "ready"; info: GetMobInfoResponse };

const detailViews = ["Stats", "Habs", "Drops",] as const;

const enemyTypeLabels: Record<GetMobInfoResponse["mob"]["target_type"], string> = {
    animales: "Animales",
    orcos: "Orcos",
    medio_humanos: "Medio Humanos",
    misticos: "Místicos",
    demonios: "Demonios",
    monstruos: "Monstruos",
};

export const MobInfoModal = ({ mob, onClose, onFight, isStartingFight }: MobInfoModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const [state, setState] = useState<MobInfoState>({ status: "loading" });
    const [attempt, setAttempt] = useState(0);
    const [imageMissing, setImageMissing] = useState(false);
    const [isChoosingQuantity, setIsChoosingQuantity] = useState(false);
    const [activeView, setActiveView] = useState<typeof detailViews[number]>("Stats");

    useEffect(() => {
        const dialog = dialogRef.current;
        const zonePanel = dialog?.parentElement;
        if (!dialog || !zonePanel) return;

        const alignWithZone = () => {
            const { left, right } = zonePanel.getBoundingClientRect();
            const viewportWidth = document.documentElement.clientWidth;
            dialog.style.left = `${Math.max(8, left)}px`;
            dialog.style.width = `${Math.max(0, Math.min(viewportWidth - 8, right) - Math.max(8, left))}px`;
        };

        alignWithZone();
        dialog.showModal();

        const observer = new ResizeObserver(alignWithZone);
        observer.observe(zonePanel);
        window.addEventListener("resize", alignWithZone);
        window.addEventListener("scroll", alignWithZone);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", alignWithZone);
            window.removeEventListener("scroll", alignWithZone);
            dialog.close();
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const loadInfo = async () => {
            try {
                const info = await getMobInfoRequest({ idMob: mob.idMob }, controller.signal);
                if (!controller.signal.aborted) setState({ status: "ready", info });
            } catch {
                if (!controller.signal.aborted) setState({ status: "error" });
            }
        };
        void loadInfo();
        return () => controller.abort();
    }, [attempt, mob.idMob]);

    const detail = state.status === "ready" ? state.info : null;
    const info = detail?.mob;

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            className="fixed inset-y-0 right-auto mx-0 my-auto max-h-[calc(100dvh-2rem)] max-w-none overflow-y-auto bg-transparent p-0 text-[#382010]"
        >
            <div className="relative grid min-h-64 grid-cols-2 items-center gap-3 bg-[url('/mobs/background/panel-mob-1.png')] bg-[length:100%_100%] bg-no-repeat px-[9%] py-[13%] sm:aspect-[1660/895]">
                <button
                    type="button"
                    aria-label="Cerrar detalle del enemigo"
                    onClick={onClose}
                    className="absolute top-[20%] right-[8%] z-10 grid size-7 cursor-pointer place-items-center rounded-full border border-[#8a572c] bg-[#f7dfa9] text-lg leading-none hover:bg-amber-100 focus-visible:outline-2"
                >
                    ×
                </button>
                <header className="absolute top-[19%] left-[7%] w-[37%] text-center">
                    <h3 id={titleId} className="wrap-break-word font-metin text-base leading-tight font-bold sm:text-2xl">
                        {info?.nombre ?? mob.nombre}
                    </h3>
                    {info && <p className="mt-1 text-sm">Tipo: {enemyTypeLabels[info.target_type]}</p>}
                    <p className="mt-1 text-sm font-semibold">Lv {info?.lv ?? mob.lv}</p>
                </header>
                <div className="flex min-w-0 justify-center">
                    {imageMissing ? (
                        <p className="text-center text-sm">Imagen no disponible</p>
                    ) : (
                        <img
                            src={getMobImagePath(mob.idMob)}
                            alt={info?.nombre ?? mob.nombre}
                            onError={() => setImageMissing(true)}
                            className="max-h-[min(21vw,8.5rem)] w-full max-w-[8.5rem] -translate-x-[26%] translate-y-[34%] object-contain"
                        />
                    )}
                </div>
                <div className="@container min-w-0 self-start sm:-mt-5">
                    {state.status === "loading" && <p role="status" className="text-sm">Cargando información…</p>}
                    {state.status === "error" && (
                        <div className="space-y-2 text-sm">
                            <p role="alert">No se pudo obtener la información del enemigo.</p>
                            <button
                                type="button"
                                className="cursor-pointer font-semibold underline"
                                onClick={() => {
                                    setState({ status: "loading" });
                                    setAttempt((current) => current + 1);
                                }}
                            >
                                Reintentar
                            </button>
                        </div>
                    )}
                    {detail && (
                        <div className="@min-[23rem]:mt-2 @min-[23rem]:-mr-5 @min-[23rem]:-ml-16">
                            <div role="group" aria-label="Vista del enemigo" className="mb-2 flex h-8 justify-center gap-2">
                                {detailViews.map((view) => (
                                    <button
                                        key={view}
                                        type="button"
                                        aria-pressed={activeView === view}
                                        onClick={() => setActiveView(view)}
                                        className={`cursor-pointer rounded border border-[#8a572c] px-2 font-metin text-xs font-semibold focus-visible:outline-2 sm:px-4 ${activeView === view
                                            ? "bg-[#56351d] text-amber-100"
                                            : "bg-[#f7dfa9] hover:bg-amber-100"}`}
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                            <div className="flow-root h-[258px]">
                                {activeView === "Stats" && (
                                    <div className="custom-scrollbar grid max-h-full items-start gap-2 overflow-y-auto @min-[23rem]:grid-cols-[max-content_minmax(0,1fr)]">
                                        <MobGeneralStatsPanel general={detail.mob.stats.general} />
                                        <MobBonusPanel stats={detail.mob.stats} />
                                    </div>
                                )}
                                {activeView === "Habs" && (
                                    <p className="pt-6 text-center text-sm font-semibold">No tiene habilidades</p>
                                )}
                                {activeView === "Drops" && <MobDropsPanel {...detail} />}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setIsChoosingQuantity(true)}
                    disabled={isStartingFight || state.status !== "ready" || !info || info.maxQuantitySpawn < 1}
                    aria-busy={isStartingFight}
                    className="mob-fight-button absolute bottom-[3.5%] left-1/2 z-10 aspect-[250/76] w-[25%] max-w-[250px] -translate-x-1/2 cursor-pointer bg-[url('/utils/explorar/boton-pelea.png')] bg-contain bg-center bg-no-repeat font-metin text-sm font-semibold text-amber-100 [text-shadow:0_1px_3px_#000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:cursor-wait disabled:opacity-60 sm:text-xl"
                >
                    Pelear
                </button>
            </div>
            {isChoosingQuantity && info && (
                <FightQuantityModal
                    mobName={info.nombre}
                    maxQuantity={info.maxQuantitySpawn}
                    onClose={() => setIsChoosingQuantity(false)}
                    onConfirm={(quantity) => {
                        if (isStartingFight || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > info.maxQuantitySpawn) return;
                        setIsChoosingQuantity(false);
                        onFight(quantity);
                    }}
                />
            )}
        </dialog>
    );
};
