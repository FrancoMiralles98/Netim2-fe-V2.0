import { useEffect, useState } from "react";
import type { CharacterSession, InventoryItem } from "netim2-shared";
import { InventoryItemSlot } from "./components/InventoryItemSlot";
import { INVENTORY_COLUMNS, INVENTORY_ROWS, INVENTORY_SLOT_SIZE } from "./inventory.constants";
import { canPlaceItemAt } from "./inventory-placement";
import { useInventoryActions } from "./hooks/useInventoryActions";
import { useEquipmentActions } from "../equip/hooks/useEquipmentActions";
import { usePotionActions } from "./hooks/usePotionActions";
import { useBuffActions } from "./hooks/useBuffActions";
import { canMergeInventoryItems } from "./inventory-merge";
import { useModal } from "../../shared/modal/hooks/useModal";
import { useCharacterSession } from "../characterSession/hooks/useCharacterSession";
import { canPotionRestore } from "./potion-restoration";
import { getItemImagePath } from "./getItemImagePath";
import { useChestActions } from "./hooks/useChestActions";
import { ChestRewardModal } from "./components/ChestRewardModal";
import { PickChestSelectionModal } from "./components/PickChestSelectionModal";

const INVENTORY_SLOTS = Array.from(
    { length: INVENTORY_COLUMNS * INVENTORY_ROWS },
    (_, index) => index,
);

interface InventoryProps {
    items: InventoryItem[];
    character: Pick<CharacterSession, "id" | "lv" | "raza" | "buffos" | "stats" | "inventario">;
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

const getItemAtSlot = (items: InventoryItem[], slot: HoveredSlot) => items.find((item) =>
    isItemWithinInventory(item)
    && slot.row >= item.position.row
    && slot.row < item.position.row + item.size.rows
    && slot.col >= item.position.col
    && slot.col < item.position.col + item.size.cols,
);

export const Inventory = ({ items, character }: InventoryProps) => {
    const { moveItem, splitItem, mergeItems, discardItem, isPending: isInventoryPending } = useInventoryActions(character);
    const modal = useModal();
    const { equipItem, isPending: isEquipPending } = useEquipmentActions(character);
    const { activatePotion, activateReservePotion, isPending: isPotionPending } = usePotionActions(character);
    const { applyBuff, isPending: isBuffPending } = useBuffActions(character);
    const { openRandomChest, openAllChest, openManyChests, loadPickChest, claimPickedItems, pickSelection, dismissPickSelection, reveal, onRevealStopped, dismissReveal, isPending: isChestPending } = useChestActions(character);
    const { gameConfig } = useCharacterSession();
    const isPending = isInventoryPending || isEquipPending || isPotionPending || isBuffPending || isChestPending;
    const [activeMenuItemId, setActiveMenuItemId] = useState<string | null>(null);
    const [quantitySelection, setQuantitySelection] = useState<{ itemId: string; action: "use" | "split" | "openBulk" } | null>(null);
    const [movingItemId, setMovingItemId] = useState<string | null>(null);
    const [mergingItemId, setMergingItemId] = useState<string | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<HoveredSlot | null>(null);
    const movingItem = items.find((item) => item.id === movingItemId);
    const mergingItem = items.find((item) => item.id === mergingItemId);

    useEffect(() => {
        if (!movingItemId && !mergingItemId) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            setMovingItemId(null);
            setMergingItemId(null);
            setHoveredSlot(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [movingItemId, mergingItemId]);

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
                if (isPending || (!movingItem && !mergingItem)) return;

                const slot = getSlotAtPoint(event.currentTarget.getBoundingClientRect(), event.clientX, event.clientY);
                if (!slot) return;

                if (mergingItem) {
                    setMergingItemId(null);
                    const target = getItemAtSlot(items, slot);
                    if (target && canMergeInventoryItems(mergingItem, target)) {
                        void mergeItems(mergingItem, target);
                    }
                    return;
                }

                if (!movingItem) return;

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
                    suppressTooltip={isPending || activeMenuItemId !== null || quantitySelection !== null || movingItem !== undefined || mergingItem !== undefined}
                    onToggleMenu={() => {
                        if (isPending || movingItem || mergingItem) return;
                        setQuantitySelection(null);
                        setActiveMenuItemId((current) => current === item.id ? null : item.id);
                    }}
                    onCloseMenu={() => setActiveMenuItemId(null)}
                    onEquip={item.type === "equip" ? () => {
                        if (isPending) return;
                        setActiveMenuItemId(null);
                        void equipItem(item);
                    } : undefined}
                    onUse={item.type === "utility" && (item.type_utility === "poción" || item.type_utility === "buff") ? () => {
                        if (isPending) return;
                        setActiveMenuItemId(null);
                        if (item.type_utility === "buff") {
                            const activeBuffs = character.buffos.filter((buff) =>
                                Date.now() < buff.buff_inicialization + buff.buff_duration * 1000,
                            );
                            const existingBuff = activeBuffs.find((buff) => buff.id_buff === item.idBuff);
                            if (existingBuff) {
                                modal.showActionModal({
                                    title: `Ya tienes activo ${existingBuff.buff_name}.`,
                                    subTitle: `Si usas ${item.name}, reemplazará al buffo actual del mismo tipo.`,
                                    acceptText: "Reemplazar",
                                    onAccept: () => applyBuff({ itemId: item.id }),
                                });
                                return;
                            }

                            const maxActiveBuffs = gameConfig?.buff.max_active_buff;
                            if (!Number.isSafeInteger(maxActiveBuffs) || maxActiveBuffs === undefined || maxActiveBuffs <= 0) {
                                modal.showNotificationModal({ title: "No se pudo verificar el límite de buffos activos." });
                                return;
                            }
                            if (activeBuffs.length >= maxActiveBuffs) {
                                modal.showNotificationModal({
                                    title: `No puedes aplicar otro buffo: ya alcanzaste el límite de ${maxActiveBuffs} buffos activos.`,
                                });
                                return;
                            }

                            void applyBuff({ itemId: item.id });
                            return;
                        }
                        if (!canPotionRestore(item, character.stats.general)) {
                            modal.showNotificationModal({ title: "Esta poción no puede recuperar vida ni maná en este momento." });
                            return;
                        }
                        if (item.potionType === "reserve") {
                            void activateReservePotion({ itemId: item.id });
                        } else {
                            setQuantitySelection({ itemId: item.id, action: "use" });
                        }
                    } : undefined}
                    onOpen={item.type === "utility" && item.type_utility === "chest" ? () => {
                        if (isPending) return;
                        setActiveMenuItemId(null);
                        if (item.rewardConfig === "random") {
                            void openRandomChest(item);
                        } else if (item.rewardConfig === "pick") {
                            void loadPickChest(item);
                        } else {
                            void openAllChest(item);
                        }
                    } : undefined}
                    onOpenBulk={item.type === "utility" && item.type_utility === "chest" && item.rewardConfig === "random" && item.allowBulkOpen ? () => {
                        if (isPending || item.cantidad < 2) return;
                        setActiveMenuItemId(null);
                        setQuantitySelection({ itemId: item.id, action: "openBulk" });
                    } : undefined}
                    onSplit={item.type === "utility" && item.acc && item.maxCantidad > 1 ? () => {
                        if (isPending || item.cantidad <= 1) return;
                        setActiveMenuItemId(null);
                        setQuantitySelection({ itemId: item.id, action: "split" });
                    } : undefined}
                    onMerge={item.type === "utility" && item.acc && item.maxCantidad > 1 ? () => {
                        if (isPending || item.cantidad <= 0) return;
                        setActiveMenuItemId(null);
                        setHoveredSlot(null);
                        setMergingItemId(item.id);
                    } : undefined}
                    onDiscard={() => {
                        if (isPending) return;
                        setActiveMenuItemId(null);
                        modal.showActionModal({
                            title: "¿Seguro que deseas deshacer este ítem?",
                            subTitle: `Se eliminará ${item.name} del inventario. Esta acción no se puede revertir.`,
                            acceptText: "Deshacer",
                            onAccept: () => discardItem({ itemId: item.id }),
                        });
                    }}
                    splitDisabled={item.type === "utility" && item.cantidad <= 1}
                    openBulkDisabled={item.type === "utility" && item.cantidad < 2}
                    quantityOpen={quantitySelection?.itemId === item.id}
                    quantityAction={quantitySelection?.itemId === item.id ? quantitySelection.action : undefined}
                    onCloseQuantity={() => setQuantitySelection(null)}
                    onConfirmQuantity={(quantity) => {
                        if (isPending || item.type !== "utility" || !Number.isSafeInteger(quantity)) return;
                        if (quantitySelection?.action === "split") {
                            if (!item.acc || item.maxCantidad <= 1 || quantity < 1 || quantity >= item.cantidad) return;
                            setQuantitySelection(null);
                            void splitItem(item, items, quantity);
                            return;
                        }
                        if (quantitySelection?.action === "openBulk") {
                            if (item.type_utility !== "chest" || item.rewardConfig !== "random" || !item.allowBulkOpen || quantity < 2 || quantity > item.cantidad) return;
                            setQuantitySelection(null);
                            void openManyChests(item, quantity);
                            return;
                        }
                        if (quantitySelection?.action !== "use" || item.type_utility !== "poción") return;
                        if (quantity < 1 || quantity > item.cantidad) return;
                        setQuantitySelection(null);
                        void activatePotion({ itemId: item.id, quantity });
                    }}
                    onMove={() => {
                        if (isPending) return;
                        setActiveMenuItemId(null);
                        setHoveredSlot(null);
                        setMovingItemId(item.id);
                        setMergingItemId(null);
                    }}
                />
            ))}
            {reveal && <ChestRewardModal reveal={reveal} onStopped={onRevealStopped} onClose={dismissReveal} />}
            {pickSelection && (
                <PickChestSelectionModal
                    selection={pickSelection}
                    character={character}
                    isPending={isChestPending}
                    onConfirm={ids => { void claimPickedItems(ids); }}
                    onClose={dismissPickSelection}
                />
            )}
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
            {mergingItem && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 grid"
                    style={{
                        gridTemplateColumns: `repeat(${INVENTORY_COLUMNS}, ${INVENTORY_SLOT_SIZE}px)`,
                        gridTemplateRows: `repeat(${INVENTORY_ROWS}, ${INVENTORY_SLOT_SIZE}px)`,
                    }}
                >
                    {INVENTORY_SLOTS.map((slot) => {
                        const target = getItemAtSlot(items, {
                            row: Math.floor(slot / INVENTORY_COLUMNS),
                            col: slot % INVENTORY_COLUMNS,
                        });
                        return (
                            <span
                                key={slot}
                                className={target && canMergeInventoryItems(mergingItem, target)
                                    ? "bg-emerald-500/35"
                                    : "bg-red-600/35"}
                            />
                        );
                    })}
                </div>
            )}
            {movingItem && hoveredSlot && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
                    <img
                        src={getItemImagePath(movingItem.idItem) ?? movingItem.img}
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
