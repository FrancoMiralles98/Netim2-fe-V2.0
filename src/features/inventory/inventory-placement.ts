import type { InventoryItem } from "netim2-shared";
import { INVENTORY_COLUMNS, INVENTORY_ROWS } from "./inventory.constants";

const isAreaFree = (
    size: InventoryItem["size"],
    items: Pick<InventoryItem, "id" | "size" | "position">[],
    row: number,
    col: number,
    excludedItemId?: InventoryItem["id"],
) => {
    const { rows, cols } = size;

    if (!Number.isInteger(row) || !Number.isInteger(col)
        || !Number.isInteger(rows) || !Number.isInteger(cols)
        || rows <= 0 || cols <= 0
        || row < 0 || col < 0
        || row + rows > INVENTORY_ROWS || col + cols > INVENTORY_COLUMNS) {
        return false;
    }

    return !items.some((other) => {
        if (other.id === excludedItemId) return false;

        return row < other.position.row + other.size.rows
            && row + rows > other.position.row
            && col < other.position.col + other.size.cols
            && col + cols > other.position.col;
    });
};

export const canPlaceItemAt = (
    item: InventoryItem,
    items: InventoryItem[],
    row: number,
    col: number,
) => isAreaFree(item.size, items, row, col, item.id);

export const findFreeInventoryPosition = (
    item: Pick<InventoryItem, "size">,
    items: Pick<InventoryItem, "id" | "size" | "position">[],
) => {
    for (let row = 0; row < INVENTORY_ROWS; row++) {
        for (let col = 0; col < INVENTORY_COLUMNS; col++) {
            if (isAreaFree(item.size, items, row, col)) return { row, col };
        }
    }

    return null;
};
