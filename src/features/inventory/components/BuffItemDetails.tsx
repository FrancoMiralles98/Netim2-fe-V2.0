import type { BuffType } from "netim2-shared";
import { CorruptImplicitBonuses, ImplicitBonuses } from "./EquipBonusGroups";
import { ItemStockAndPrice } from "./ItemStockAndPrice";

export const BuffItemDetails = ({ item }: { item: BuffType }) => (
    <section className="w-[200px] max-w-[calc(100vw-48px)] p-1 text-center">
        <h3 className="text-[14px] font-medium text-white">{item.name}</h3>
        <p className="mt-1 text-[11px] text-gray-200">Tipo de Buff: <span className="text-emerald-200">{item.idBuff}</span></p>

        {(item.implicitBonus.length > 0 || item.corruptBonus.length > 0) && (
            <div className="mt-2 space-y-2 whitespace-normal break-words text-[12px] leading-[16px]">
                <ImplicitBonuses bonuses={item.implicitBonus} />
                <CorruptImplicitBonuses bonuses={item.corruptBonus} />
            </div>
        )}

        <div className="mt-3 space-y-1 text-[12px] text-gray-200">
            <p>[ Duración ]</p>
            <p>{item.duration} {item.duration === 1 ? "minuto" : "minutos"}.</p>
        </div>

        <ItemStockAndPrice item={item} />
    </section>
);
