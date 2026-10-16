import type { CharacterSession, InventoryItem } from "netim2-shared";
import { INVENTORY_SLOT_SIZE } from "../inventory.constants";
import { InventoryItemTooltip } from "./InventoryItemTooltip";

interface InventoryItemSlotProps {
    item: InventoryItem;
    character: Pick<CharacterSession, "lv" | "raza">;
    menuOpen: boolean;
    suppressTooltip: boolean;
    onToggleMenu: () => void;
    onCloseMenu: () => void;
    onMove: () => void;
}

export const InventoryItemSlot = ({ item, character, menuOpen, suppressTooltip, onToggleMenu, onCloseMenu, onMove }: InventoryItemSlotProps) => (
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
        >
            <img src={item.img} alt={item.name} className="h-full w-full object-contain" />
        </InventoryItemTooltip>
    </div>
);
