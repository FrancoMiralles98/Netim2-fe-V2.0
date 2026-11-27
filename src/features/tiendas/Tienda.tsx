import type { CharacterSession, NpcShopId } from "netim2-shared";
import { tiendas } from "./tiendas.config";
import { Inventory } from "../inventory/Inventory";
import { VentaRapida } from "./components/VentaRapida";
import { useShopItems } from "./hooks/useShopItems";
import { ShopCatalog } from "./components/ShopCatalog";
import { useState } from "react";
import { ShopPurchasePanel } from "./components/ShopPurchasePanel";
import type { ShopItemOffer } from "netim2-shared";
import { useShopPurchase } from "./hooks/useShopPurchase";
import { useShopSale } from "./hooks/useShopSale";

interface TiendaProps {
    character: CharacterSession;
    tipo: NpcShopId;
}

export const Tienda = ({ character, tipo }: TiendaProps) => {
    const { items, isLoading, error, retry } = useShopItems(tipo);
    const [selectedOffer, setSelectedOffer] = useState<ShopItemOffer | null>(null);
    const { buy, isPending: isBuying } = useShopPurchase(tipo);
    const { sell, isPending: isSelling } = useShopSale(tipo);
    const [quickSale, setQuickSale] = useState(false);

    return (
    <section
        aria-label={tiendas[tipo].nombre}
        aria-busy={isLoading}
        className="relative aspect-[4/3] w-[1100px] justify-self-center bg-[length:100%_100%] bg-no-repeat"
        style={{ backgroundImage: character.reino ? `url('/game/modal-${character.reino}-rectangular.png')` : undefined }}
    >
        <div className="absolute inset-[5%] grid place-items-center">
            <div className="relative w-full">
                <img
                    src="/tiendas/tienda.png"
                    alt={`Panel de ${tiendas[tipo].nombre}`}
                    className="block h-auto w-full"
                />
                <h2
                    className="absolute top-[0.8%] left-[33%] flex h-[5.5%] w-[34%] items-center justify-center text-center font-serif text-[24px] font-normal leading-none text-[#f5e7cb] [text-shadow:0_2px_2px_#160700,0_0_4px_#000]"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    {tiendas[tipo].nombre}
                </h2>
                <img
                    src={tiendas[tipo].icono}
                    alt={`Comerciante de ${tiendas[tipo].nombre}`}
                    className="absolute top-[9%] left-[1.5%] h-[48%] w-[29%] object-contain"
                />
                <VentaRapida activada={quickSale} onChange={setQuickSale} />
                <ShopCatalog key={tipo} shopId={tipo} offers={items} character={character}
                    isLoading={isLoading} error={error} onRetry={retry} onSelect={setSelectedOffer} />
                {selectedOffer && <ShopPurchasePanel key={`${selectedOffer.idItem}:${selectedOffer.upgradeLv ?? 0}`} offer={selectedOffer} isPending={isBuying} onBuy={quantity => buy(selectedOffer, quantity)} />}
                <div
                    role="region"
                    aria-label="Inventario del personaje"
                    className="absolute top-[65%] left-[11%] flex h-[32%] w-[81%] items-center justify-center font-sans"
                >
                    <Inventory items={character.inventario} character={character} onSell={sell} quickSale={quickSale} isShopPending={isSelling || isBuying} />
                </div>
            </div>
        </div>
    </section>
    );
};
