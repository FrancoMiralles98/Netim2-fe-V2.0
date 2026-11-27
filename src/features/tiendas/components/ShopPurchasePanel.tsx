import { useState } from "react";
import type { ShopItemOffer } from "netim2-shared";
import { InventoryItemVisual } from "../../inventory/components/InventoryItemVisual";
import "./shop-purchase-panel.css";
import "./shop-catalog.css";

const formatter = new Intl.NumberFormat("es-AR");

interface ShopPurchasePanelProps {
    offer: ShopItemOffer;
    isPending: boolean;
    onBuy: (quantity: number) => Promise<void>;
}

export const ShopPurchasePanel = ({ offer, isPending, onBuy }: ShopPurchasePanelProps) => {
    const [quantity, setQuantity] = useState(offer.quantity);
    const step = offer.quantity;
    const maxQuantity = Math.floor(offer.maxQuantity / step) * step;
    const scale = Math.min(1, 54 / (offer.item.size.rows * 32));

    return (
        <section className="shop-purchase" aria-label="Ítem seleccionado para comprar" aria-busy={isPending}>
            <div className="shop-purchase__item">
                <div style={{ width: offer.item.size.cols * 32 * scale, height: offer.item.size.rows * 32 * scale, backgroundImage: "url('/game/inventory/bg_item.png')", backgroundSize: `${32 * scale}px ${32 * scale}px` }}>
                    <InventoryItemVisual item={offer.item} showIndicators={false} />
                </div>
            </div>
            <p className="shop-purchase__name">{offer.item.name}{offer.upgradeLv ? ` +${offer.upgradeLv}` : ""}</p>
            <div className="shop-purchase__field">
                <span>Precio unitario:</span>
                <strong className="flex items-center gap-1">{formatter.format(offer.price)} <img src="/utils/yang-icon.png" alt="Yang" className="size-3 object-contain" /></strong>
            </div>
            <div className="shop-purchase__field">
                <label htmlFor="shop-purchase-quantity">Cantidad:</label>
                <div className="shop-purchase__quantity">
                    <button type="button" aria-label="Reducir cantidad" disabled={isPending || quantity <= step} onClick={() => setQuantity(value => Math.max(step, value - step))}>−</button>
                    <input id="shop-purchase-quantity" type="number" disabled={isPending} min={step} max={maxQuantity} step={step} value={quantity} onChange={event => {
                        const value = Number(event.target.value);
                        if (Number.isFinite(value)) setQuantity(Math.min(maxQuantity, Math.max(step, Math.floor(value / step) * step)));
                    }} />
                    <button type="button" aria-label="Aumentar cantidad" disabled={isPending || quantity >= maxQuantity} onClick={() => setQuantity(value => Math.min(maxQuantity, value + step))}>+</button>
                </div>
            </div>
            <div className="shop-purchase__field" aria-live="polite">
                <span>Total:</span>
                <strong className="flex items-center gap-1">{formatter.format(offer.price * quantity)} <img src="/utils/yang-icon.png" alt="Yang" className="size-3 object-contain" /></strong>
            </div>
            <button type="button" className="shop-purchase__buy" disabled={isPending} onClick={() => void onBuy(quantity)}>{isPending ? "Comprando…" : "Comprar"}</button>
        </section>
    );
};
