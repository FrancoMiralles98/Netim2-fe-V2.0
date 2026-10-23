import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ChestGrantedReward, ChestType, InventoryItem } from "netim2-shared";
import { getItemImagePath } from "../getItemImagePath";
import type { ChestReveal } from "../hooks/useChestActions";

type Prize = {
    kind: "item" | "yang" | "exp";
    idItem?: InventoryItem["idItem"];
    label: string;
    amount?: number;
    upgradeLv?: number;
};

const numberFormatter = new Intl.NumberFormat("es-AR");
const CARD_WIDTH = 104;
const CARD_GAP = 8;
const SPIN_DURATION = 5500;

const toOption = (reward: ChestType["rewards"][number]): Prize =>
    reward.type_reward === "item"
        ? { kind: "item", idItem: reward.idItem, label: "Ítem" }
        : { kind: reward.type_resource, label: reward.type_resource === "yang" ? "Yang" : "EXP" };

const toWinner = (reward: ChestGrantedReward, name: string): Prize =>
    reward.type === "item"
        ? { kind: "item", idItem: reward.idItem, label: name, amount: reward.quantity, upgradeLv: reward.upgradeLv }
        : { kind: reward.resource, label: name, amount: reward.amount };

const groupStackableRewards = (rewards: ChestReveal["rewards"]): ChestReveal["rewards"] => {
    const grouped: ChestReveal["rewards"] = [];
    const groupIndexes = new Map<string, number>();

    for (const entry of rewards) {
        if (entry.reward.type === "item" && entry.stackable) {
            const key = `${entry.reward.idItem}:${entry.reward.upgradeLv ?? ""}`;
            const index = groupIndexes.get(key);
            if (index !== undefined) {
                const previous = grouped[index];
                if (previous.reward.type === "item") {
                    grouped[index] = {
                        ...previous,
                        reward: { ...previous.reward, quantity: previous.reward.quantity + entry.reward.quantity },
                    };
                    continue;
                }
            }
            groupIndexes.set(key, grouped.length);
        }
        grouped.push(entry);
    }

    return grouped;
};

const PrizeDisplay = ({ prize, revealed }: { prize: Prize; revealed: boolean }) => {
    const imagePath = prize.kind === "item" && prize.idItem !== undefined
        ? getItemImagePath(prize.idItem)
        : null;

    return (
        <div className="flex h-full flex-col items-center justify-center gap-1 px-1">
            <div className="flex h-24 items-center justify-center">
                {imagePath ? (
                    <img src={imagePath} alt="" className="[image-rendering:pixelated]" />
                ) : prize.kind === "yang" ? (
                    <img src="/utils/yang-icon.png" alt="" className="h-14 w-14 object-contain" />
                ) : (
                    <span className="text-2xl font-bold tracking-wider text-[#e9c76f] [text-shadow:0_0_12px_#a97735]">
                        {prize.kind === "exp" ? "EXP" : "Ítem"}
                    </span>
                )}
            </div>
            <span className="line-clamp-2 text-center text-xs text-[#f3e4c5]">
                {prize.kind === "item" && !revealed ? "Ítem" : prize.label}
                {revealed && prize.upgradeLv !== undefined ? ` +${prize.upgradeLv}` : ""}
            </span>
            {revealed && prize.amount !== undefined && (
                <span className="text-xs text-emerald-300">
                    {prize.kind === "item" ? "×" : "+"}{numberFormatter.format(prize.amount)}
                </span>
            )}
        </div>
    );
};

interface ChestRewardModalProps {
    reveal: ChestReveal;
    onStopped: () => void;
    onClose: () => void;
}

const SingleChestRewardModal = ({ reveal, onStopped, onClose }: ChestRewardModalProps) => {
    const options = useMemo(() => reveal.options.map(toOption), [reveal.options]);
    const winner = useMemo(() => toWinner(reveal.rewards[0].reward, reveal.rewards[0].name), [reveal.rewards]);
    const reel = useMemo(() => {
        const pool = options.length ? options : [winner];
        const spinCount = Math.max(30, Math.min(48, pool.length * 5));
        return {
            winnerIndex: spinCount,
            prizes: [
                ...Array.from({ length: spinCount }, (_, index) => pool[index % pool.length]),
                winner,
                pool[0],
                pool[1 % pool.length],
            ],
        };
    }, [options, winner]);
    const [started, setStarted] = useState(false);
    const [stopped, setStopped] = useState(false);
    const completed = useRef(false);
    const onStoppedRef = useRef(onStopped);

    useEffect(() => {
        onStoppedRef.current = onStopped;
    }, [onStopped]);

    const finish = useCallback(() => {
        if (completed.current) return;
        completed.current = true;
        setStopped(true);
        onStoppedRef.current();
    }, []);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const timer = window.setTimeout(finish, 0);
            return () => window.clearTimeout(timer);
        }

        let secondFrame = 0;
        const firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => setStarted(true));
        });
        return () => {
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(secondFrame);
        };
    }, [finish]);

    useEffect(() => {
        if (!started || stopped) return;
        // Respaldo para pestañas ocultas o navegadores que no emiten transitionend.
        const timer = window.setTimeout(finish, SPIN_DURATION + 300);
        return () => window.clearTimeout(timer);
    }, [finish, started, stopped]);

    const targetOffset = (reel.winnerIndex - 1) * (CARD_WIDTH + CARD_GAP);

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Recompensa del cofre">
            <div className="w-full max-w-[390px] rounded border border-[#a97735] bg-[#0c0b0a] px-4 py-5 text-center shadow-[0_0_30px_rgba(0,0,0,0.9)]">
                <h2 className="text-lg font-semibold text-[#e9cf99]">{stopped ? "En el cofre había..." : "Abriendo cofre..."}</h2>
                <div className="relative my-4 border-y border-[#8e683b]/60 pb-4 pt-7">
                    <div className="absolute left-1/2 top-1 z-10 h-0 w-0 -translate-x-1/2 border-x-[9px] border-t-[14px] border-x-transparent border-t-[#e9c76f]" aria-hidden="true" />
                    <div className="mx-auto w-[328px] max-w-full overflow-hidden" aria-hidden="true">
                        <div
                            className="flex gap-2"
                            style={{
                                transform: `translateX(-${started || stopped ? targetOffset : 0}px)`,
                                transition: started ? `transform ${SPIN_DURATION}ms cubic-bezier(0.12, 0.75, 0.2, 1)` : "none",
                            }}
                            onTransitionEnd={event => {
                                if (event.target === event.currentTarget && event.propertyName === "transform") finish();
                            }}
                        >
                            {reel.prizes.map((prize, index) => (
                                <div
                                    key={index}
                                    className={`h-[152px] w-[104px] shrink-0 border bg-[#15120e] ${stopped && index === reel.winnerIndex ? "border-[#e9c76f] shadow-[inset_0_0_12px_#a97735]" : "border-[#695332]"}`}
                                >
                                    <PrizeDisplay prize={prize} revealed={stopped && index === reel.winnerIndex} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {stopped && <p className="mb-4 text-sm text-[#e9cf99]" aria-live="polite">{winner.label}</p>}
                {stopped ? (
                    <button type="button" autoFocus onClick={onClose} className="rounded border border-[#a97735] px-5 py-1.5 text-sm text-[#e9cf99] hover:bg-[#8e683b]/30">
                        Aceptar
                    </button>
                ) : (
                    <p className="text-xs text-[#b7a686]">Descubriendo recompensa...</p>
                )}
            </div>
        </div>,
        document.body,
    );
};

const BulkChestRewardModal = ({ reveal, onStopped, onClose }: ChestRewardModalProps) => {
    const groupedRewards = useMemo(() => groupStackableRewards(reveal.rewards), [reveal.rewards]);

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Recompensas de los cofres">
            <div className="max-h-[calc(100dvh-32px)] w-full max-w-[580px] overflow-y-auto rounded border border-[#a97735] bg-[#0c0b0a] px-4 py-5 text-center shadow-[0_0_30px_rgba(0,0,0,0.9)]">
                <h2 className="text-lg font-semibold text-[#e9cf99]">
                    {reveal.mode === "pick" ? "Recompensas obtenidas"
                        : reveal.mode === "all" ? "En el cofre había..."
                            : `En los ${reveal.openedQuantity} cofres había...`}
                </h2>
                <div className="my-4 flex max-h-[346px] flex-wrap justify-center gap-2 overflow-y-auto border-y border-[#8e683b]/60 py-4" aria-live="polite">
                    {groupedRewards.map(({ reward, name }, index) => (
                        <div key={index} className="h-[152px] w-[104px] border border-[#a97735] bg-[#15120e]">
                            <PrizeDisplay prize={toWinner(reward, name)} revealed />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    autoFocus
                    onClick={() => {
                        onStopped();
                        onClose();
                    }}
                    className="rounded border border-[#a97735] px-5 py-1.5 text-sm text-[#e9cf99] hover:bg-[#8e683b]/30"
                >
                    Aceptar
                </button>
            </div>
        </div>,
        document.body,
    );
};

export const ChestRewardModal = (props: ChestRewardModalProps) =>
    props.reveal.mode !== "single"
        ? <BulkChestRewardModal {...props} />
        : <SingleChestRewardModal {...props} />;
