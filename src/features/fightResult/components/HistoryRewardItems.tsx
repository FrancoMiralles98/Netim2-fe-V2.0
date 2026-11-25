import type { PendingHistoryReward } from "netim2-shared";
import { useHistoryRewards } from "../../game/hooks/useHistoryRewards";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { InventoryItemTooltip } from "../../inventory/components/InventoryItemTooltip";
import { InventoryItemVisual } from "../../inventory/components/InventoryItemVisual";
import { INVENTORY_SLOT_SIZE } from "../../inventory/inventory.constants";

interface HistoryRewardItemsProps {
    historialId: string;
    initialRewards?: PendingHistoryReward[];
}

export const HistoryRewardItems = ({ historialId, initialRewards }: HistoryRewardItemsProps) => {
    const { character } = useCharacterSession();
    const { pendingItems, isClaiming, loadError, claimRewards, retry } = useHistoryRewards(historialId, initialRewards);

    return (
        <div className="mt-5 border-t border-amber-700/30 pt-4" aria-busy={isClaiming}>
            <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-semibold text-amber-100">Ítems obtenidos</h3>
                {pendingItems && pendingItems.length > 0 && (
                    <button
                        type="button"
                        disabled={isClaiming}
                        onClick={() => void claimRewards(pendingItems.map(reward => reward.rewardId))}
                        className="cursor-pointer rounded border border-amber-700 bg-amber-950/50 px-3 py-1 text-sm text-amber-100 hover:bg-amber-900/60 disabled:cursor-wait disabled:opacity-40"
                    >
                        Reclamar todo
                    </button>
                )}
            </div>
            {!pendingItems && !loadError && <p role="status" className="mt-2 text-xs text-slate-400">Obteniendo recompensas pendientes…</p>}
            {!pendingItems && loadError && (
                <div role="alert" className="mt-2 text-sm text-slate-300">
                    <p>No se pudieron obtener las recompensas pendientes.</p>
                    <button type="button" onClick={retry} className="mt-1 cursor-pointer text-amber-200 underline">Reintentar</button>
                </div>
            )}
            {pendingItems?.length === 0 && <p className="mt-2 text-xs text-slate-400">Todas las recompensas fueron reclamadas.</p>}
            {pendingItems && pendingItems.length > 0 && (
                <>
                    <p className="mt-1 text-xs text-slate-400">Apretá sobre un ítem para reclamar la recompensa.</p>
                    <ul className="mt-4 flex flex-wrap items-center gap-3">
                        {pendingItems.map(({ rewardId, item }) => (
                            <li key={rewardId} className="shrink-0 bg-[url('/game/inventory/bg_item.png')] bg-repeat" style={{
                                width: item.size.cols * INVENTORY_SLOT_SIZE,
                                height: item.size.rows * INVENTORY_SLOT_SIZE,
                                backgroundSize: `${INVENTORY_SLOT_SIZE}px ${INVENTORY_SLOT_SIZE}px`,
                            }}>
                                <InventoryItemTooltip item={item} character={character ?? undefined} suppressTooltip={isClaiming}>
                                    <button
                                        type="button"
                                        aria-label={`Reclamar ${item.name}`}
                                        disabled={isClaiming}
                                        onClick={() => void claimRewards([rewardId])}
                                        className="block h-full w-full cursor-pointer hover:brightness-125 focus-visible:outline-2 focus-visible:outline-amber-200 disabled:cursor-wait disabled:opacity-50"
                                    >
                                        <InventoryItemVisual item={item} />
                                    </button>
                                </InventoryItemTooltip>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};
