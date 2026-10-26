import type { PiedraType } from "netim2-shared";
import { CorruptExplicitBonuses, ImplicitBonuses } from "./EquipBonusGroups";
import { ItemStockAndPrice } from "./ItemStockAndPrice";

export const StoneItemDetails = ({ item }: { item: PiedraType }) => (
    <section className="w-[200px] max-w-[calc(100vw-48px)] p-1 text-center">
        <h3 className="text-[14px] font-medium text-white">{item.name} +{item.upgradeLv}</h3>

        {(item.implicitBonus.length > 0 || item.corruptExplicitBonus.length > 0) && (
            <div className="mt-2 space-y-2 whitespace-normal break-words text-[12px] leading-[16px]">
                <ImplicitBonuses bonuses={item.implicitBonus} />
                <CorruptExplicitBonuses bonuses={item.corruptExplicitBonus} />
            </div>
        )}

        <p className="mt-3 whitespace-normal text-[12px] leading-[16px] text-gray-300">
            Puede incrustarse en las ranuras del equipo para otorgar sus bonus.
        </p>

        <ItemStockAndPrice item={item} />
    </section>
);
