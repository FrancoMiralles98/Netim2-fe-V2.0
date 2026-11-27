import type { CharacterSession, EquipType, ForgeModifierItemConfig } from "netim2-shared";
import { InventoryItemTooltip } from "../../inventory/components/InventoryItemTooltip";
import { InventoryItemVisual } from "../../inventory/components/InventoryItemVisual";
import "./forge-modifiers.css";

interface ForgeModifiersProps {
    modifiers: ForgeModifierItemConfig[];
    character: CharacterSession;
    item?: EquipType;
    selectedModifierId?: string;
    isPending: boolean;
    onSelect: (modifierItemId?: string) => void;
}

export const ForgeModifiers = ({ modifiers, character, item, selectedModifierId, isPending, onSelect }: ForgeModifiersProps) => (
    <section className="forge-modifiers" aria-label="Bonificadores de forja">
        <img src="/herrero/panel-bonificaciones.png" alt="" className="forge-modifiers__frame" />
        <h2>Bonificadores</h2>
        <div className="forge-modifiers__items">
            {modifiers.map(modifier => {
                const owned = character.inventario.find(entry => entry.idItem === modifier.item.idItem && entry.type === "utility" && entry.cantidad >= modifier.config.quantity);
                const compatible = item !== undefined
                    && (!modifier.config.allowedItemIds || modifier.config.allowedItemIds.includes(item.idItem))
                    && (!modifier.config.allowedTargetUpgradeLvs || modifier.config.allowedTargetUpgradeLvs.some(level => level === item.upgradeLv + 1));
                const selected = owned !== undefined && owned.id === selectedModifierId;
                return (
                    <div key={modifier.item.idItem} className="forge-modifiers__slot" data-selected={selected}>
                        <InventoryItemTooltip item={modifier.item} character={character} showPrice={false} showStock={false} extraDetails={
                            <div className="mt-2 max-w-[220px] border-t border-[#826342] pt-2 text-xs text-amber-100">
                                {modifier.config.successChanceBonus !== undefined && <p>Bonificación de probabilidad de éxito: +{modifier.config.successChanceBonus}%.</p>}
                                {modifier.config.preventDestruction && <p>Protege el equipo de la destrucción.</p>}
                                {modifier.config.upgradeLvLossOnProtectedFailure !== undefined && <p>Al fallar con protección, pierde {modifier.config.upgradeLvLossOnProtectedFailure} nivel(es) de mejora.</p>}
                                <p className="mt-1">Consume {modifier.config.quantity} por intento.</p>
                                {!owned && <p className="mt-1 text-red-300">No tenés la cantidad necesaria en el inventario.</p>}
                                {item && !compatible && <p className="mt-1 text-red-300">No es compatible con esta mejora.</p>}
                            </div>
                        }>
                            <button type="button" aria-label={`Usar ${modifier.item.name}`} aria-pressed={selected} disabled={isPending || !owned || !compatible} onClick={() => onSelect(selected ? undefined : owned?.id)}>
                                <InventoryItemVisual item={modifier.item} showIndicators={false} />
                            </button>
                        </InventoryItemTooltip>
                        {selected && <span className="forge-modifiers__check" aria-hidden="true">✓</span>}
                    </div>
                );
            })}
        </div>
    </section>
);
