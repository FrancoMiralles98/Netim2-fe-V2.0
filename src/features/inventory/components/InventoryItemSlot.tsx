import type { CharacterSession, InventoryItem } from "netim2-shared";
import { INVENTORY_SLOT_SIZE } from "../inventory.constants";
import { InventoryItemTooltip } from "./InventoryItemTooltip";
import { getItemImagePath } from "../getItemImagePath";
import { ItemCorruptionSmoke, ItemStaticSparkles, ItemUpgradeSparkles } from "../../../shared/animations";
import { EquipSlotIndicators } from "./EquipSlotIndicators";

interface InventoryItemSlotProps {
    item: InventoryItem;
    character: Pick<CharacterSession, "lv" | "raza">;
    menuOpen: boolean;
    suppressTooltip: boolean;
    onToggleMenu: () => void;
    onCloseMenu: () => void;
    onMove: () => void;
    onEquip?: () => void;
    onUse?: () => void;
    onOpen?: () => void;
    onOpenBulk?: () => void;
    onSplit?: () => void;
    onMerge?: () => void;
    onDiscard?: () => void;
    splitDisabled?: boolean;
    openBulkDisabled?: boolean;
    quantityOpen?: boolean;
    quantityAction?: "use" | "split" | "openBulk";
    onConfirmQuantity?: (quantity: number) => void;
    onCloseQuantity?: () => void;
}

const getItemCornerLabel = (item: InventoryItem): string | number | null => {
    if (item.type === "equip") return `+${item.upgradeLv}`;
    if (item.type_utility === "caña" || item.type_utility === "piedra") return `+${item.upgradeLv}`;
    return item.acc ? item.cantidad : null;
};

export const InventoryItemSlot = ({ item, character, menuOpen, suppressTooltip, onToggleMenu, onCloseMenu, onMove, onEquip, onUse, onOpen, onOpenBulk, onSplit, onMerge, onDiscard, splitDisabled, openBulkDisabled, quantityOpen, quantityAction, onConfirmQuantity, onCloseQuantity }: InventoryItemSlotProps) => {
    const cornerLabel = getItemCornerLabel(item);

    return (
        <div
            className="absolute z-10 flex items-center justify-center"
            style={{
                top: item.position.row * INVENTORY_SLOT_SIZE,
                left: item.position.col * INVENTORY_SLOT_SIZE,
                width: item.size.cols * INVENTORY_SLOT_SIZE,
                height: item.size.rows * INVENTORY_SLOT_SIZE,
            }}
        >
            <InventoryItemTooltip
                item={item}
                character={character}
                menuOpen={menuOpen}
                suppressTooltip={suppressTooltip}
                onToggleMenu={onToggleMenu}
                onCloseMenu={onCloseMenu}
                onMove={onMove}
                onEquip={onEquip}
                onUse={onUse}
                onOpen={onOpen}
                onOpenBulk={onOpenBulk}
                onSplit={onSplit}
                onMerge={onMerge}
                onDiscard={onDiscard}
                splitDisabled={splitDisabled}
                openBulkDisabled={openBulkDisabled}
                quantityOpen={quantityOpen}
                quantityAction={quantityAction}
                onConfirmQuantity={onConfirmQuantity}
                onCloseQuantity={onCloseQuantity}
            >
                <div className="relative isolate h-full w-full">
                    {item.corrupt === true && <ItemCorruptionSmoke />}
                    <img src={getItemImagePath(item.idItem) ?? item.img} alt={item.name} className="relative z-1 h-full w-full object-contain" />
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
            </InventoryItemTooltip>
        </div>
    );
};
