import { useEffect, useState } from "react";
import type { CharacterSession, InventoryItem } from "netim2-shared";
import { InventoryItemSlot } from "./components/InventoryItemSlot";
import { INVENTORY_COLUMNS, INVENTORY_ROWS, INVENTORY_SLOT_SIZE } from "./inventory.constants";
import { canPlaceItemAt } from "./inventory-placement";
import { useInventoryActions } from "./hooks/useInventoryActions";

const INVENTORY_SLOTS = Array.from(
    { length: INVENTORY_COLUMNS * INVENTORY_ROWS },
    (_, index) => index,
);

interface InventoryProps {
    items: InventoryItem[];
    character: Pick<CharacterSession, "id" | "lv" | "raza">;
}

interface HoveredSlot {
    row: number;
    col: number;
}

const getSlotAtPoint = (rect: DOMRect, clientX: number, clientY: number): HoveredSlot | null => {
    if (rect.width === 0 || rect.height === 0) return null;

    const col = Math.floor((clientX - rect.left) / rect.width * INVENTORY_COLUMNS);
    const row = Math.floor((clientY - rect.top) / rect.height * INVENTORY_ROWS);

    if (row < 0 || row >= INVENTORY_ROWS || col < 0 || col >= INVENTORY_COLUMNS) return null;
    return { row, col };
};

const isItemWithinInventory = (item: InventoryItem) => {
    const { row, col } = item.position;
    const { rows, cols } = item.size;

    return Number.isInteger(row) && Number.isInteger(col)
        && Number.isInteger(rows) && Number.isInteger(cols)
        && row >= 0 && col >= 0 && rows > 0 && cols > 0
        && row + rows <= INVENTORY_ROWS && col + cols <= INVENTORY_COLUMNS;
};

export const Inventory = ({ items, character }: InventoryProps) => {
    const { moveItem, equipItem, isPending } = useInventoryActions(character);
    const [activeMenuItemId, setActiveMenuItemId] = useState<string | null>(null);
    const [movingItemId, setMovingItemId] = useState<string | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<HoveredSlot | null>(null);
    const movingItem = items.find((item) => item.id === movingItemId);

    useEffect(() => {
        if (!movingItemId) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            setMovingItemId(null);
            setHoveredSlot(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [movingItemId]);

    return (
        <div
            className={`relative h-[192px] w-[512px] shrink-0 ${isPending ? "cursor-wait" : ""}`}
            aria-busy={isPending}
            onPointerMove={(event) => {
                if (!movingItem) return;

                const slot = getSlotAtPoint(event.currentTarget.getBoundingClientRect(), event.clientX, event.clientY);
                setHoveredSlot((current) => current?.row === slot?.row && current?.col === slot?.col ? current : slot);
            }}
            onPointerLeave={() => setHoveredSlot(null)}
            onClick={(event) => {
                if (isPending || !movingItem || !(event.target instanceof Node) || !event.currentTarget.contains(event.target)) return;

                const slot = getSlotAtPoint(event.currentTarget.getBoundingClientRect(), event.clientX, event.clientY);
                if (!slot) return;

                setMovingItemId(null);
                setHoveredSlot(null);
                if (!canPlaceItemAt(movingItem, items, slot.row, slot.col)) return;
                if (movingItem.position.row === slot.row && movingItem.position.col === slot.col) return;

                void moveItem({ itemId: movingItem.id, position: slot });
            }}
        >
            <div
                aria-hidden="true"
                className="grid h-full w-full"
                style={{
                    gridTemplateColumns: `repeat(${INVENTORY_COLUMNS}, ${INVENTORY_SLOT_SIZE}px)`,
                    gridTemplateRows: `repeat(${INVENTORY_ROWS}, ${INVENTORY_SLOT_SIZE}px)`,
                }}
            >
                {INVENTORY_SLOTS.map((slot) => (
                    <div
                        key={slot}
                        className="h-[32px] w-[32px] bg-[url('/game/inventory/bg_item.png')] bg-no-repeat"
                    />
                ))}
            </div>
            {items.filter(isItemWithinInventory).map((item) => (
                <InventoryItemSlot
                    key={item.id}
                    item={item}
                    character={character}
                    menuOpen={activeMenuItemId === item.id}
                    suppressTooltip={isPending || activeMenuItemId !== null || movingItem !== undefined}
                    onToggleMenu={() => {
                        if (isPending || movingItem) return;
                        setActiveMenuItemId((current) => current === item.id ? null : item.id);
                    }}
                    onCloseMenu={() => setActiveMenuItemId(null)}
                    onEquip={item.type === "equip" ? () => {
                        if (isPending) return;
                        setActiveMenuItemId(null);
                        void equipItem(item);
                    } : undefined}
                    onMove={() => {
                        if (isPending) return;
                        setActiveMenuItemId(null);
                        setHoveredSlot(null);
                        setMovingItemId(item.id);
                    }}
                />
            ))}
            {movingItem && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 grid"
                    style={{
                        gridTemplateColumns: `repeat(${INVENTORY_COLUMNS}, ${INVENTORY_SLOT_SIZE}px)`,
                        gridTemplateRows: `repeat(${INVENTORY_ROWS}, ${INVENTORY_SLOT_SIZE}px)`,
                    }}
                >
                    {INVENTORY_SLOTS.map((slot) => (
                        <span
                            key={slot}
                            className={canPlaceItemAt(
                                movingItem,
                                items,
                                Math.floor(slot / INVENTORY_COLUMNS),
                                slot % INVENTORY_COLUMNS,
                            ) ? "bg-emerald-500/35" : "bg-red-600/35"}
                        />
                    ))}
                </div>
            )}
            {movingItem && hoveredSlot && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
                    <img
                        src={movingItem.img}
                        alt=""
                        className="absolute object-contain opacity-50 blur-[1px]"
                        style={{
                            top: hoveredSlot.row * INVENTORY_SLOT_SIZE,
                            left: hoveredSlot.col * INVENTORY_SLOT_SIZE,
                            width: movingItem.size.cols * INVENTORY_SLOT_SIZE,
                            height: movingItem.size.rows * INVENTORY_SLOT_SIZE,
                        }}
                    />
                </div>
            )}
        </div>
    );
};
