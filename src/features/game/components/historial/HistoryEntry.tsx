import type { PartialHistorialDetalle } from "netim2-shared";
import { formatCompactReward } from "../../../../shared/formatters/compact-reward";
import { getHistoryOutcome } from "./history-outcome";

const dates = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

const getEnemyTitle = (enemies: PartialHistorialDetalle["enemies"]) => {
    if (enemies.length === 0) return "Combate";
    const [first] = enemies;
    if (enemies.every(enemy => enemy.name === first.name)) {
        return enemies.length > 1 ? `${first.name} ×${enemies.length}` : first.name;
    }
    return enemies.map(enemy => enemy.name).join(", ");
};

export const HistoryEntry = ({ entry, onDetail }: { entry: PartialHistorialDetalle; onDetail: () => void }) => {
    const outcome = getHistoryOutcome(entry.result);
    const title = getEnemyTitle(entry.enemies);

    return (
        <li className="history-entry" data-outcome={outcome.tone}>
            <span aria-hidden="true" className="history-entry__icon">⚔</span>
            <div className="min-w-0 border-l border-[#8296a6]/45 pl-3">
                <div className="flex items-center gap-2">
                    <h3 title={title} className="truncate font-metin text-[23px] font-semibold">{title}</h3>
                    <span className="history-type shrink-0">{entry.filtro.toUpperCase()}</span>
                </div>
                <time dateTime={new Date(entry.fecha).toISOString()} className="mt-1 block text-sm text-[#a9cde5]">{dates.format(entry.fecha)}</time>
            </div>
            <dl className="border-l border-[#8296a6]/45 pl-4 text-sm">
                <div className="flex items-center justify-between gap-2"><dt>EXP otorgada</dt><dd className="text-lg text-[#ffdb7d] tabular-nums">{entry.expGranted > 0 ? "+" : ""}{formatCompactReward(entry.expGranted)}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt>Yang otorgado</dt><dd className="text-lg text-[#ffdb7d] tabular-nums">{entry.yangGranted > 0 ? "+" : ""}{formatCompactReward(entry.yangGranted)}</dd></div>
            </dl>
            <div className="flex flex-col items-center gap-2">
                
                {entry.remainingReward ? (
                    <span className="history-pending">{entry.pendingRewardCount} {entry.pendingRewardCount === 1 ? "pendiente" : "pendientes"}</span>
                ) : <span className="text-sm text-[#a9cde5]">Sin pendientes</span>}
            </div>
            <button type="button" onClick={onDetail} className="history-button history-detail-button px-3 py-2 text-sm font-semibold">Ver detalle</button>
        </li>
    );
};
