import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CharacterSession, IdItemList, ItemDTO, RewardOptions } from "netim2-shared";
import type { PickChestSelection } from "../hooks/useChestActions";
import { getItemImagePath } from "../getItemImagePath";
import { InventoryTooltipPortal } from "./InventoryTooltipPortal";
import { EquipItemDetails } from "./EquipItemDetails";
import { PotionItemDetails } from "./PotionItemDetails";
import { BuffItemDetails } from "./BuffItemDetails";
import { UtilityItemDetails } from "./UtilityItemDetails";
import { StoneItemDetails } from "./StoneItemDetails";

const PickChestItemOption = ({ item, rewardOptions, character, selected, disabled, onToggle }: {
    item: ItemDTO;
    rewardOptions?: RewardOptions;
    character: Pick<CharacterSession, "lv" | "raza">;
    selected: boolean;
    disabled: boolean;
    onToggle: () => void;
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tooltipId = useId();
    const [showDetails, setShowDetails] = useState(false);
    const upgrade = rewardOptions?.upgradeChances;
    const quantity = rewardOptions?.cantidadChances;
    const upgradeLabel = upgrade && (upgrade.min === upgrade.max
        ? `+${upgrade.min}` : `+${upgrade.min} a +${upgrade.max}`);
    const quantityLabel = quantity && (quantity.min === quantity.max
        ? `×${quantity.min}` : `×${quantity.min} a ×${quantity.max}`);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-describedby={showDetails ? tooltipId : undefined}
                onClick={onToggle}
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
                onFocus={() => setShowDetails(true)}
                onBlur={() => setShowDetails(false)}
                className={`flex min-h-[180px] flex-col items-center justify-center gap-1 rounded border p-2 text-center text-xs text-[#e9cf99] ${selected ? "border-emerald-300 bg-emerald-900/30" : "border-[#695332] bg-[#15120e] hover:border-[#c69a55]"} disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <span className="flex h-24 items-center justify-center">
                    <img src={getItemImagePath(item.idItem) ?? item.img} alt="" className="[image-rendering:pixelated]" />
                </span>
                <span className="line-clamp-2">{item.name}{upgradeLabel && upgrade?.min === upgrade?.max ? ` ${upgradeLabel}` : ""}</span>
                {upgradeLabel && upgrade?.min !== upgrade?.max && <span className="text-[11px] text-emerald-200">Mejora posible: {upgradeLabel}</span>}
                {quantityLabel && <span className="text-[11px] text-emerald-200">Cantidad: {quantityLabel}</span>}
            </button>
            {showDetails && !disabled && (
                <InventoryTooltipPortal anchorRef={buttonRef} id={tooltipId}>
                    {item.type === "equip" ? <EquipItemDetails item={item} character={character} />
                        : item.type_utility === "poción" ? <PotionItemDetails item={item} />
                            : item.type_utility === "buff" ? <BuffItemDetails item={item} />
                                : item.type_utility === "piedra" ? <StoneItemDetails item={item} />
                                : <UtilityItemDetails item={item} />}
                    {(upgradeLabel || quantityLabel) && (
                        <div className="mt-2 border-t border-[#8e683b]/60 pt-2 text-xs text-[#e9cf99]">
                            {upgradeLabel && <p>Mejora posible: {upgradeLabel}</p>}
                            {quantityLabel && <p>Cantidad posible: {quantityLabel}</p>}
                        </div>
                    )}
                </InventoryTooltipPortal>
            )}
        </>
    );
};

export const PickChestSelectionModal = ({ selection, character, isPending, onConfirm, onClose }: {
    selection: PickChestSelection;
    character: Pick<CharacterSession, "lv" | "raza">;
    isPending: boolean;
    onConfirm: (ids: IdItemList[]) => void;
    onClose: () => void;
}) => {
    const [selectedIds, setSelectedIds] = useState<IdItemList[]>([]);
    const remaining = selection.chest.pickCount - selectedIds.length;

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isPending) onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isPending, onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Elegir recompensas del cofre">
            <div className="max-h-[calc(100dvh-32px)] w-full max-w-[620px] overflow-y-auto rounded border border-[#a97735] bg-[#0c0b0a] px-5 py-5 text-center shadow-[0_0_30px_rgba(0,0,0,0.9)]">
                <h2 className="text-lg font-semibold text-[#e9cf99]">Elige tus recompensas</h2>
                <p className="mt-1 text-sm text-[#e9cf99]" aria-live="polite">
                    Seleccionados: {selectedIds.length}/{selection.chest.pickCount} · Faltan: {remaining}
                </p>
                <div className="my-4 grid max-h-[55dvh] grid-cols-2 gap-2 overflow-y-auto border-y border-[#8e683b]/60 py-4 sm:grid-cols-4">
                    {selection.items.map(item => {
                        const reward = selection.chest.rewards.find(entry => entry.type_reward === "item" && entry.idItem === item.idItem);
                        if (!reward || reward.type_reward !== "item") return null;
                        return (
                            <PickChestItemOption
                                key={item.idItem}
                                item={item}
                                rewardOptions={reward.rewardOptions}
                                character={character}
                                selected={selectedIds.includes(item.idItem)}
                                disabled={isPending || (remaining === 0 && !selectedIds.includes(item.idItem))}
                                onToggle={() => setSelectedIds(current => current.includes(item.idItem)
                                    ? current.filter(id => id !== item.idItem)
                                    : current.length < selection.chest.pickCount ? [...current, item.idItem] : current)}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-center gap-3 text-sm">
                    <button type="button" disabled={isPending} onClick={onClose} className="rounded border border-[#695332] px-4 py-1.5 text-gray-200 hover:bg-[#8e683b]/30 disabled:opacity-40">Cancelar</button>
                    <button type="button" disabled={isPending || remaining !== 0} onClick={() => onConfirm(selectedIds)} className="rounded border border-[#a97735] px-4 py-1.5 text-[#e9cf99] hover:bg-[#8e683b]/30 disabled:cursor-not-allowed disabled:opacity-40">Aceptar</button>
                </div>
            </div>
        </div>,
        document.body,
    );
};
