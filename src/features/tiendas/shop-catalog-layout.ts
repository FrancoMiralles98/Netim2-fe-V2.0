import type { ItemDTO, NpcShopId, ShopItemOffer } from "netim2-shared";

export const SHOP_ROWS = 5;
export const SHOP_COLUMNS = 10;

const CATEGORY_LABELS: Record<string, string> = {
    equip: "Equipo",
    arma: "Armas", armadura: "Armaduras", casco: "Cascos", escudo: "Escudos",
    botas: "Botas", brazalete: "Brazaletes", collar: "Collares", pendiente: "Pendientes",
    flecha: "Arcos", daga: "Dagas", espada: "Espadas", dos_manos: "Dos manos", campana: "Campanas", fan: "Abanicos",
    poción: "Pociones", buff: "Buffos", piedra: "Piedras", caña: "Cañas",
    cebo: "Cebos", montura: "Monturas", chest: "Cofres", utility: "Otros",
};

export const getShopCategory = (item: ItemDTO, shopId: NpcShopId) => {
    if (item.type !== "equip") return `utility:${item.type_utility}`;
    if (shopId === "weapons" && item.type_weapon) return `weapon:${item.type_weapon}`;
    if (shopId === "weapons" || shopId === "armors") return `equip:${item.sub_type_equip}`;
    return "equip";
};

export const getShopFilters = (offers: ShopItemOffer[], shopId: NpcShopId) => [
    { id: "all", label: "Todos" },
    ...Array.from(new Set(offers.map(offer => getShopCategory(offer.item, shopId)))).map(id => {
        const category = id === "equip" ? id : id.split(":")[1];
        return { id, label: CATEGORY_LABELS[category] ?? category.replaceAll("_", " ") };
    }),
];

export interface PositionedShopOffer {
    offer: ShopItemOffer;
    row: number;
    col: number;
    rows: number;
    cols: number;
}

/** Distribuye las ofertas sin solaparlas y conserva páginas de 5 × 10 celdas. */
export const paginateShopOffers = (offers: ShopItemOffer[]): PositionedShopOffer[][] => {
    const pages: PositionedShopOffer[][] = [[]];
    let occupied = Array<boolean>(SHOP_ROWS * SHOP_COLUMNS).fill(false);

    for (const offer of offers) {
        const rows = Math.min(SHOP_ROWS, Math.max(1, Math.trunc(offer.item.size.rows) || 1));
        const cols = Math.min(SHOP_COLUMNS, Math.max(1, Math.trunc(offer.item.size.cols) || 1));
        const findPosition = () => {
            for (let row = 0; row <= SHOP_ROWS - rows; row++) {
                for (let col = 0; col <= SHOP_COLUMNS - cols; col++) {
                    const free = Array.from({ length: rows }, (_, r) =>
                        Array.from({ length: cols }, (_, c) => !occupied[(row + r) * SHOP_COLUMNS + col + c]),
                    ).every(line => line.every(Boolean));
                    if (free) return { row, col };
                }
            }
            return null;
        };
        let position = findPosition();
        if (!position) {
            occupied = Array<boolean>(SHOP_ROWS * SHOP_COLUMNS).fill(false);
            pages.push([]);
            position = { row: 0, col: 0 };
        }
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) occupied[(position.row + r) * SHOP_COLUMNS + position.col + c] = true;
        }
        pages[pages.length - 1].push({ offer, ...position, rows, cols });
    }
    return pages;
};
