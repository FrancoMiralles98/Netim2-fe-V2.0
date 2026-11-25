import type { CharacterFightResultResponse, InitialFighterStats, PendingHistoryReward } from "netim2-shared";
import { HistoryRewardItems } from "./HistoryRewardItems";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { InventoryItemTooltip } from "../../inventory/components/InventoryItemTooltip";
import { InventoryItemVisual } from "../../inventory/components/InventoryItemVisual";
import { INVENTORY_SLOT_SIZE } from "../../inventory/inventory.constants";

const numberFormatter = new Intl.NumberFormat("es-AR");

export type FightRewardsData = Pick<CharacterFightResultResponse, "result" | "yang" | "exp" | "items"> & {
    initialFighters: Pick<InitialFighterStats, "fighterId" | "name" | "side">[];
    historialId?: string;
    pendingItems?: PendingHistoryReward[];
};

export const FightRewardsSummary = ({ response }: { response: FightRewardsData }) => {
    const { character } = useCharacterSession();
    const { result, initialFighters, yang, exp, items } = response;
    const winnerIds = result.winnerFighterIds?.length
        ? result.winnerFighterIds
        : result.winnerFighterId ? [result.winnerFighterId] : [];
    const winners = initialFighters.filter(fighter => winnerIds.length > 0
        ? winnerIds.includes(fighter.fighterId)
        : fighter.side === result.winnerSide);
    const isDraw = result.outcome === "draw";
    const won = result.winnerSide === "allies" || winners.some(fighter => fighter.side === "allies");
    const title = isDraw ? "Empate" : won ? "Victoria" : "Derrota";
    const rewards = [
        { label: "Yang ganado", icon: "/utils/yang-icon.png", amount: yang },
        { label: "EXP ganada", icon: "/utils/exp-icon.png", amount: exp },
    ];

    return (
        <section aria-label="Resultado y recompensas" className="mb-8 rounded-xl border border-amber-700/50 bg-linear-to-br from-stone-900 to-slate-950 p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h2 className={`font-metin text-2xl font-bold ${isDraw ? "text-slate-300" : won ? "text-amber-300" : "text-red-400"}`}>
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-300">
                        {isDraw ? "La pelea terminó en empate." : `Ganador: ${winners.map(fighter => fighter.name).join(", ") || (won ? "Aliados" : "Enemigos")}`}
                    </p>
                </div>
                <dl className="flex flex-wrap gap-6">
                    {rewards.map(({ label, icon, amount }) => (
                        <div key={label}>
                            <dt className="mb-1 text-xs text-slate-400">{label}</dt>
                            <dd className="flex items-center gap-2 font-semibold text-amber-100 tabular-nums">
                                <img src={icon} alt="" className="size-5 object-contain" />
                                {numberFormatter.format(amount)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
            {items.length > 0 && response.historialId ? (
                <HistoryRewardItems key={response.historialId} historialId={response.historialId} initialRewards={response.pendingItems} />
            ) : items.length > 0 && (
                <div className="mt-5 border-t border-amber-700/30 pt-4">
                    <h3 className="font-semibold text-amber-100">Ítems obtenidos</h3>
                    <p className="mt-1 text-xs text-slate-400">Pendientes de reclamar en el historial.</p>
                    <ul className="mt-4 flex flex-wrap items-center gap-3">
                        {items.map((item, index) => (
                            <li key={index} className="shrink-0 bg-[url('/game/inventory/bg_item.png')] bg-repeat" style={{
                                width: item.size.cols * INVENTORY_SLOT_SIZE,
                                height: item.size.rows * INVENTORY_SLOT_SIZE,
                                backgroundSize: `${INVENTORY_SLOT_SIZE}px ${INVENTORY_SLOT_SIZE}px`,
                            }}>
                                <InventoryItemTooltip item={item} character={character ?? undefined}>
                                    <InventoryItemVisual item={item} />
                                </InventoryItemTooltip>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};
