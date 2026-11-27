import { useId, useState } from "react";
import type { CharacterSession, NpcShopId, ShopItemOffer } from "netim2-shared";
import { INVENTORY_SLOT_SIZE } from "../../inventory/inventory.constants";
import { InventoryItemTooltip } from "../../inventory/components/InventoryItemTooltip";
import { InventoryItemVisual } from "../../inventory/components/InventoryItemVisual";
import { getShopFilters, getShopCategory, paginateShopOffers, SHOP_COLUMNS, SHOP_ROWS } from "../shop-catalog-layout";
import "./shop-catalog.css";

interface ShopCatalogProps {
    shopId: NpcShopId;
    offers: ShopItemOffer[];
    character: Pick<CharacterSession, "lv" | "raza">;
    isLoading: boolean;
    error: unknown;
    onRetry: () => void;
    onSelect: (offer: ShopItemOffer) => void;
}

const slots = Array.from({ length: SHOP_COLUMNS * SHOP_ROWS }, (_, index) => index);
const formatter = new Intl.NumberFormat("es-AR");

/** Muestra el catálogo recibido del servidor con filtros y celdas del inventario. */
export const ShopCatalog = ({ shopId, offers, character, isLoading, error, onRetry, onSelect }: ShopCatalogProps) => {
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(0);
    const panelId = useId();
    const filters = getShopFilters(offers, shopId);
    const activeFilter = filters.some(option => option.id === filter) ? filter : "all";
    const filtered = activeFilter === "all" ? offers : offers.filter(offer => getShopCategory(offer.item, shopId) === activeFilter);
    const pages = paginateShopOffers(filtered);
    const currentPage = Math.min(page, pages.length - 1);

    return (
        <section className="shop-catalog" aria-label="Ítems de la tienda" aria-busy={isLoading}>
            <div className="shop-catalog__filters" role="group" aria-label="Filtrar por tipo de ítem">
                {filters.map(option => (
                    <button key={option.id} type="button" className="shop-catalog__filter"
                        aria-pressed={activeFilter === option.id} aria-controls={panelId}
                        onClick={() => { setFilter(option.id); setPage(0); }}>
                        {option.label}
                    </button>
                ))}
            </div>
            <div id={panelId} className="shop-catalog__grid" style={{
                width: SHOP_COLUMNS * INVENTORY_SLOT_SIZE, height: SHOP_ROWS * INVENTORY_SLOT_SIZE,
            }}>
                <div className="shop-catalog__cells" aria-hidden="true" style={{
                    gridTemplateColumns: `repeat(${SHOP_COLUMNS}, ${INVENTORY_SLOT_SIZE}px)`,
                    gridTemplateRows: `repeat(${SHOP_ROWS}, ${INVENTORY_SLOT_SIZE}px)`,
                }}>
                    {slots.map(slot => <div key={slot} className="shop-catalog__cell" />)}
                </div>
                {!isLoading && error === null && (
                    <ul className="shop-catalog__items" aria-label="Ofertas de la tienda">
                        {pages[currentPage].map(({ offer, row, col, rows, cols }) => (
                            <li key={`${offer.idItem}:${offer.upgradeLv ?? 0}`} className="shop-catalog__item" style={{
                                top: row * INVENTORY_SLOT_SIZE, left: col * INVENTORY_SLOT_SIZE,
                                width: cols * INVENTORY_SLOT_SIZE, height: rows * INVENTORY_SLOT_SIZE,
                            }}>
                                <InventoryItemTooltip item={offer.item} character={character} showPrice={false} extraDetails={
                                    <div className="mt-2 border-t border-[#826342] pt-2 text-[12px] text-[#e9d6ac]">
                                        <p className="flex flex-wrap items-center justify-center gap-1">
                                            Compra: <span className="text-yellow-300">{formatter.format(offer.bundlePrice)}</span>
                                            <img src="/utils/yang-icon.png" alt="Yang" className="size-3 object-contain" />
                                            {offer.quantity > 1 && <span>por {formatter.format(offer.quantity)} unidades</span>}
                                        </p>
                                        <p className="mt-1 text-[11px] text-[#bbaa8b]">Máximo por compra: {formatter.format(offer.maxQuantity)}</p>
                                    </div>
                                }>
                                    <button type="button" aria-label={`Seleccionar ${offer.item.name}`} onClick={() => onSelect(offer)} className="block h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-200">
                                        <InventoryItemVisual item={offer.item} />
                                    </button>
                                </InventoryItemTooltip>
                            </li>
                        ))}
                    </ul>
                )}
                {isLoading && <p className="shop-catalog__message" role="status">Cargando ítems…</p>}
                {!isLoading && error !== null && (
                    <div className="shop-catalog__message" role="alert">
                        <p>No se pudieron cargar los ítems.</p>
                        <button type="button" className="shop-catalog__retry" onClick={onRetry}>Reintentar</button>
                    </div>
                )}
                {!isLoading && error === null && filtered.length === 0 && (
                    <p className="shop-catalog__message" role="status">No hay ítems disponibles.</p>
                )}
            </div>
            {pages.length > 1 && !isLoading && error === null && (
                <nav className="shop-catalog__pages" aria-label="Páginas del catálogo">
                    <button type="button" disabled={currentPage === 0} aria-label="Página anterior"
                        onClick={() => setPage(currentPage - 1)}>‹</button>
                    <span aria-live="polite">{currentPage + 1} / {pages.length}</span>
                    <button type="button" disabled={currentPage === pages.length - 1} aria-label="Página siguiente"
                        onClick={() => setPage(currentPage + 1)}>›</button>
                </nav>
            )}
        </section>
    );
};
