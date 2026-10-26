import type { PocionType, ReservePotion } from "netim2-shared";
import { ItemStockAndPrice } from "./ItemStockAndPrice";

const numberFormatter = new Intl.NumberFormat("es-AR");

const getReservePercentage = (actual: number, max: number) => {
    if (!Number.isFinite(actual) || !Number.isFinite(max) || max <= 0) return 0;
    return Math.round(Math.min(100, Math.max(0, actual / max * 100)));
};

const getRestoredResources = (resources: ReservePotion["resource"]) => {
    const restoresHp = resources.includes("hp");
    const restoresMana = resources.includes("mana");
    if (restoresHp && restoresMana) return "vida y maná";
    if (restoresHp) return "vida";
    if (restoresMana) return "maná";
    return "recursos";
};

export const PotionItemDetails = ({ item }: { item: PocionType }) => (
    <section className="w-[200px] max-w-[calc(100vw-48px)] whitespace-normal break-words p-1 text-center">
        <h3 className="text-[14px] font-medium text-white">{item.name}</h3>

        {item.potionType === "reserve" ? (
            <div className="mt-2 space-y-1 text-[12px] leading-[17px] text-gray-200">
                <p>
                    Disponible: <span className="text-emerald-300">{getReservePercentage(item.reserve.actual, item.reserve.max)}%</span>
                </p>
                <p> Poción que restaura {getRestoredResources(item.resource)}.</p>
                <p> Contiene una reserva máxima de <span className="text-emerald-300">{numberFormatter.format(item.reserve.max)}</span> puntos de recuperación.</p>
                {item.description && <p>{item.description}</p>}
            </div>
        ) : (
            <div className="mt-2 space-y-1 text-[12px] leading-[17px] text-gray-200">
                {item.effect.map((effect, index) => (
                    <p key={`${effect.resource}-${index}`}>
                        Restaura <span className={`inline-block bg-gradient-to-r bg-clip-text text-transparent ${effect.resource === "hp"
                            ? "from-[#e56b70] to-[#ff9a9d]"
                            : "from-[#70bfff] to-[#a3ddff]"}`}>+{numberFormatter.format(effect.amount)}</span>
                        {effect.resource === "hp" ? " de vida." : " de maná."}
                    </p>
                ))}
                {item.description && <p>{item.description}</p>}
            </div>
        )}

        <ItemStockAndPrice item={item} />
    </section>
);
