import type { InventoryItem } from "netim2-shared";
import { INVENTORY_COLUMNS, INVENTORY_ROWS } from "./inventory.constants";

export const canPlaceItemAt = (
    item: InventoryItem,
    items: InventoryItem[],
    row: number,
    col: number,
) => {
    const { rows, cols } = item.size;

    if (!Number.isInteger(row) || !Number.isInteger(col)
        || !Number.isInteger(rows) || !Number.isInteger(cols)
        || rows <= 0 || cols <= 0
        || row < 0 || col < 0
        || row + rows > INVENTORY_ROWS || col + cols > INVENTORY_COLUMNS) {
        return false;
    }

    return !items.some((other) => {
        if (other.id === item.id) return false;

        return row < other.position.row + other.size.rows
            && row + rows > other.position.row
            && col < other.position.col + other.size.cols
            && col + cols > other.position.col;
    });
};
