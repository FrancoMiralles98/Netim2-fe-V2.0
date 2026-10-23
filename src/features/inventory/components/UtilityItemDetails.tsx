import type { UtilityType } from "netim2-shared";
import { ItemStockAndPrice } from "./ItemStockAndPrice";

type UtilityDetailsItem = Pick<UtilityType, "name" | "description" | "cantidad" | "maxCantidad" | "price">;

export const UtilityItemDetails = ({ item }: { item: UtilityDetailsItem }) => (
    <section className="w-[200px] max-w-[calc(100vw-48px)] p-1 text-center">
        <h3 className="text-[14px] font-medium text-white">{item.name}</h3>
        {item.description?.trim() && (
            <p className="mt-2 whitespace-normal break-words text-[12px] leading-[17px] text-gray-200">{item.description}</p>
        )}
        <ItemStockAndPrice item={item} />
    </section>
);
