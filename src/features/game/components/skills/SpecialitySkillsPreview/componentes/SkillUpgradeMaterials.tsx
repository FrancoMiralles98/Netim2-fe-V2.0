import { useEffect, useState } from "react";
import type { GetItemsResponse, SkillUpgradeCost } from "netim2-shared";
import { getItemsRequest } from "../../../../../inventory/api/item-details.services";
import { InventoryItemTooltip } from "../../../../../inventory/components/InventoryItemTooltip";
import { getItemImagePath } from "../../../../../inventory/getItemImagePath";
import { INVENTORY_SLOT_SIZE } from "../../../../../inventory/inventory.constants";
import { useCharacterSession } from "../../../../../characterSession/hooks/useCharacterSession";

export const SkillUpgradeMaterials = ({ items }: { items: Extract<SkillUpgradeCost, { type: 'materials' }>['items'] }) => {
    const { character } = useCharacterSession();
    const key = JSON.stringify(items.map(item => item.idItem));
    const [result, setResult] = useState<{ key: string; items: GetItemsResponse }>();
    const [error, setError] = useState<string>();
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        let active = true;
        const ids: typeof items[number]['idItem'][] = JSON.parse(key);
        void getItemsRequest({ items: ids.map(idItem => ({ idItem })) }).then(data => {
            if (active) { setResult({ key, items: data }); setError(undefined); }
        }, () => { if (active) setError(key); });
        return () => { active = false; };
    }, [key, attempt]);
    return <div className="space-y-2"><p>Materiales necesarios:</p>
        {error === key && <button type="button" className="text-red-300 underline" onClick={() => setAttempt(value => value + 1)}>No se pudieron cargar los materiales. Reintentar</button>}
        <div className="flex flex-wrap items-start gap-3">{items.map((cost, index) => {
            const base = result?.key === key ? result.items.find(item => item.idItem === cost.idItem) : undefined;
            if (!base) return <span key={index} className="text-slate-400">Cargando material…</span>;
            const item = { ...base, ...(base.type === 'utility' ? { cantidad: cost.amount } : {}), id: `cost-${index}`, position: { row: 0, col: 0 } };
            return <div key={index} className="shrink-0" style={{ width: base.size.cols * INVENTORY_SLOT_SIZE, height: base.size.rows * INVENTORY_SLOT_SIZE }}>
                <InventoryItemTooltip item={item} character={character ?? undefined}>
                <div className="relative" style={{ width: base.size.cols * INVENTORY_SLOT_SIZE, height: base.size.rows * INVENTORY_SLOT_SIZE, backgroundImage: "url('/game/inventory/bg_item.png')", backgroundSize: `${INVENTORY_SLOT_SIZE}px ${INVENTORY_SLOT_SIZE}px` }}>
                    <img src={getItemImagePath(base.idItem) ?? base.img} alt={base.name} className="h-full w-full object-contain" />
                    <span className="absolute right-[2px] bottom-[1px] text-[11px] font-semibold text-white drop-shadow-[0_1px_2px_#000]">{cost.amount}</span>
                </div>
                </InventoryItemTooltip>
            </div>;
        })}</div>
    </div>;
};
