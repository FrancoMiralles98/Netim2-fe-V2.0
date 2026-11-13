import type { ItemDTO } from "netim2-shared";
import { ItemCorruptionSmoke, ItemSpecialImage, ItemStaticSparkles, ItemUpgradeSparkles } from "../../../shared/animations";
import { getItemImagePath } from "../getItemImagePath";
import { EquipSlotIndicators } from "./EquipSlotIndicators";

const getItemCornerLabel = (item: ItemDTO): string | number | null => {
    if (item.type === "equip") return `+${item.upgradeLv}`;
    if (item.type_utility === "caña" || item.type_utility === "piedra") return `+${item.upgradeLv}`;
    return item.acc ? item.cantidad : null;
};

export const InventoryItemVisual = ({ item }: { item: ItemDTO }) => {
    const cornerLabel = getItemCornerLabel(item);

    return (
        <div className="relative isolate h-full w-full">
            {item.corrupt === true && <ItemCorruptionSmoke />}
            <ItemSpecialImage item={item} src={getItemImagePath(item.idItem) ?? item.img} alt={item.name} className="relative z-1 h-full w-full object-contain" />
            {item.type === "equip" && item.upgradeLv === 9 && <ItemUpgradeSparkles />}
            {item.type === "equip" && item.upgradeLv === 8 && <ItemStaticSparkles />}
            {item.type === "equip" && item.upgradeLv === 7 && <ItemStaticSparkles variant="bronze" />}
            {item.type === "equip" && <EquipSlotIndicators slots={item.slot} filledSlots={item.piedras.length} />}
            {cornerLabel !== null && (
                <span className="pointer-events-none absolute right-[2px] bottom-[1px] z-3 text-[11px] leading-none font-semibold text-white drop-shadow-[0_1px_2px_#000]">
                    {cornerLabel}
                </span>
            )}
        </div>
    );
};
