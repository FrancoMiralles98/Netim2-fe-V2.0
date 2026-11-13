import type { CharacterSession, InventoryItem } from "netim2-shared";
import { INVENTORY_SLOT_SIZE } from "../inventory.constants";
import { InventoryItemTooltip } from "./InventoryItemTooltip";
import { InventoryItemVisual } from "./InventoryItemVisual";

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

export const InventoryItemSlot = ({ item, character, menuOpen, suppressTooltip, onToggleMenu, onCloseMenu, onMove, onEquip, onUse, onOpen, onOpenBulk, onSplit, onMerge, onDiscard, splitDisabled, openBulkDisabled, quantityOpen, quantityAction, onConfirmQuantity, onCloseQuantity }: InventoryItemSlotProps) => {

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
                <InventoryItemVisual item={item} />
            </InventoryItemTooltip>
        </div>
    );
};
