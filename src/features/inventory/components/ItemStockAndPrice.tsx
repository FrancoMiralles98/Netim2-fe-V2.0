import type { UtilityType } from "netim2-shared";

const numberFormatter = new Intl.NumberFormat("es-AR");

export const ItemStock = ({ item }: { item: Pick<UtilityType, "cantidad" | "maxCantidad"> }) => (
    item.maxCantidad !== 1 ? (
        <div className="mt-3 flex justify-center gap-1 text-[11px] text-gray-200/80">
            <span>Stock:</span>
            <span>{numberFormatter.format(item.cantidad)} / {numberFormatter.format(item.maxCantidad)}</span>
        </div>
    ) : null
);

export const ItemStockAndPrice = ({ item }: { item: Pick<UtilityType, "cantidad" | "maxCantidad" | "price"> }) => (
    <>
        <ItemStock item={item} />
        <p className="mt-3 flex items-center justify-center gap-1 text-[12px] text-gray-200/80">
            Precio: <span className="text-yellow-300">{numberFormatter.format(item.price * item.cantidad)}</span>
            <img src="/utils/yang-icon.png" alt="Yang" className="h-[12px] w-[12px] object-contain" />
        </p>
    </>
);
