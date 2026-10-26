import type { InventoryItem } from "netim2-shared";

export const canMergeInventoryItems = (source: InventoryItem, target: InventoryItem): boolean =>
    source.id !== target.id
    && source.type === "utility"
    && target.type === "utility"
    && source.acc === true
    && target.acc === true
    && source.idItem === target.idItem
    && Number.isSafeInteger(source.cantidad)
    && source.cantidad > 0
    && source.cantidad <= source.maxCantidad
    && Number.isSafeInteger(target.cantidad)
    && target.cantidad > 0
    && target.cantidad < target.maxCantidad
    && Number.isSafeInteger(source.maxCantidad)
    && source.maxCantidad > 1
    && Number.isSafeInteger(target.maxCantidad)
    && target.maxCantidad > 1;
