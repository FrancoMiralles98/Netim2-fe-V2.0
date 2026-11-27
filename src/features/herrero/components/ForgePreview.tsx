import type { CharacterSession, EquipType, ItemDTO, PreviewForgeUpgradeResponse } from "netim2-shared";
import { InventoryItemTooltip } from "../../inventory/components/InventoryItemTooltip";
import { InventoryItemVisual } from "../../inventory/components/InventoryItemVisual";
import { ForgeSuccessChance } from "./ForgeSuccessChance";
import { ForgeDurability } from "./ForgeDurability";

const numberFormatter = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

const ForgeItem = ({ item, character, onRemove }: { item: ItemDTO; character: CharacterSession; onRemove?: () => void }) => {
    const scale = Math.min(1, 72 / (item.size.rows * 32), 64 / (item.size.cols * 32));
    return (
        <div style={{ width: item.size.cols * 32 * scale, height: item.size.rows * 32 * scale }}>
            <InventoryItemTooltip item={item} character={character}>
                {onRemove ? (
                    <button type="button" onClick={onRemove} aria-label="Retirar de la forja" title="Retirar de la forja" className="block h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-200">
                        <InventoryItemVisual item={item} />
                    </button>
                ) : <InventoryItemVisual item={item} />}
            </InventoryItemTooltip>
        </div>
    );
};

interface ForgePreviewProps {
    item: EquipType;
    preview: PreviewForgeUpgradeResponse;
    character: CharacterSession;
    onRemove: () => void;
}

export const ForgePreview = ({ item, preview, character, onRemove }: ForgePreviewProps) => (
    <>
        <div className="forge-current-item" role="group" aria-label="Ítem colocado en el yunque">
            <ForgeItem item={item} character={character} onRemove={onRemove} />
        </div>
        <div className="forge-upgrade-arrow" aria-hidden="true" />
        <div className="forge-next-item" role="group" aria-label={`Vista previa de mejora a +${preview.targetUpgradeLv}`}>
            <ForgeItem item={preview.item} character={character} />
        </div>
        <section className="forge-preview-details" aria-label="Requisitos y probabilidades de mejora">
            <p className="flex items-center justify-between gap-2">
                Costo:
                <span className={`flex items-center gap-1 ${character.yang < preview.yangCost ? "text-red-300" : "text-yellow-200"}`}>
                    {numberFormatter.format(preview.yangCost)}
                    <img src="/utils/yang-icon.png" alt="Yang" className="size-3 object-contain" />
                </span>
            </p>
            <div className="forge-preview-materials">
                <h3 className="shrink-0 text-[#e9cf99]">Materiales</h3>
                {preview.materials.length === 0 ? <p className="whitespace-nowrap text-xs text-stone-300">Sin materiales necesarios.</p> : (
                    <ul className="custom-scrollbar flex h-full min-w-0 items-center gap-3 overflow-x-auto">
                        {preview.materials.map(material => {
                            const available = character.inventario.reduce((total, entry) => total + (entry.idItem === material.item.idItem ? (entry.type === "utility" ? entry.cantidad : 1) : 0), 0);
                            return (
                                <li key={material.item.idItem} aria-label={material.item.name} className="flex shrink-0 flex-col items-center gap-1">
                                    <div className="size-8 shrink-0 bg-[url('/game/inventory/bg_item.png')]">
                                        <InventoryItemTooltip item={material.item} character={character} showPrice={false} showStock={false}>
                                            <InventoryItemVisual item={material.item} showIndicators={false} />
                                        </InventoryItemTooltip>
                                    </div>
                                    <span aria-label={`Disponible: ${available}. Necesario: ${material.quantity}`} className={`shrink-0 whitespace-nowrap text-xs ${available >= material.quantity ? "text-emerald-200" : "text-red-300"}`}>{numberFormatter.format(available)} / {numberFormatter.format(material.quantity)}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            <ForgeSuccessChance chance={preview.chances.success} />
            <ForgeDurability current={preview.durability.current} max={preview.durability.max} />
            <button type="button" className="forge-durability__upgrade">Mejorar</button>
        </section>
    </>
);
