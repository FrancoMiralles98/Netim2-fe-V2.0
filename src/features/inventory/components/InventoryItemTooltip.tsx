import { useId, useRef, useState, type ReactNode } from "react";
import type { CharacterSession, EquipType, InventoryItem } from "netim2-shared";
import { InventoryItemActionMenu } from "./InventoryItemActionMenu";
import { EquipItemDetails } from "./EquipItemDetails";
import { PotionItemDetails } from "./PotionItemDetails";
import { UtilityItemDetails } from "./UtilityItemDetails";
import { BuffItemDetails } from "./BuffItemDetails";
import { StoneItemDetails } from "./StoneItemDetails";
import { FishingRodItemDetails } from "./FishingRodItemDetails";
import { BaitItemDetails } from "./BaitItemDetails";
import { ItemQuantityPopover } from "./ItemQuantityPopover";
import { InventoryTooltipPortal } from "./InventoryTooltipPortal";

type CharacterRequirements = Pick<CharacterSession, "lv" | "raza">;

interface InventoryItemTooltipProps {
    item: InventoryItem | EquipType;
    character?: CharacterRequirements;
    children: ReactNode;
    menuOpen?: boolean;
    suppressTooltip?: boolean;
    onToggleMenu?: () => void;
    onCloseMenu?: () => void;
    onMove?: () => void;
    onEquip?: () => void;
    onUnequip?: () => void;
    onUse?: () => void;
    onOpen?: () => void;
    onOpenBulk?: () => void;
    onSplit?: () => void;
    onMerge?: () => void;
    onDiscard?: () => void;
    splitDisabled?: boolean;
    openBulkDisabled?: boolean;
    quantityOpen?: boolean;
    quantityAction?: "use" | "split" | "openBulk";
    onConfirmQuantity?: (quantity: number) => void;
    onCloseQuantity?: () => void;
}

export const InventoryItemTooltip = ({
    item,
    character,
    children,
    menuOpen = false,
    suppressTooltip = false,
    onToggleMenu,
    onCloseMenu,
    onMove,
    onEquip,
    onUnequip,
    onUse,
    onOpen,
    onOpenBulk,
    onSplit,
    onMerge,
    onDiscard,
    splitDisabled,
    openBulkDisabled,
    quantityOpen = false,
    quantityAction,
    onConfirmQuantity,
    onCloseQuantity,
}: InventoryItemTooltipProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const hasActions = Boolean(onToggleMenu && onCloseMenu && (onMove || onEquip || onUnequip || onUse || onOpen || onOpenBulk || onSplit || onMerge || onDiscard));
    const hasDetails = item.type === "equip" || item.type === "utility";

    const openTooltip = () => {
        if (!hasDetails || suppressTooltip) return;
        setIsOpen(true);
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e9cf99]"
                role={hasActions ? "button" : "group"}
                tabIndex={0}
                aria-label={hasActions ? `Acciones de ${item.name}` : item.name}
                aria-haspopup={hasActions ? "menu" : undefined}
                aria-expanded={hasActions ? menuOpen : undefined}
                aria-describedby={isOpen && !suppressTooltip && hasDetails ? tooltipId : undefined}
                onMouseEnter={openTooltip}
                onMouseLeave={() => setIsOpen(false)}
                onFocus={openTooltip}
                onBlur={() => setIsOpen(false)}
                onClick={() => {
                    if (!hasActions) return;
                    setIsOpen(false);
                    onToggleMenu?.();
                }}
                onKeyDown={(event) => {
                    if (!hasActions) return;
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    setIsOpen(false);
                    onToggleMenu?.();
                }}
            >
                {children}
            </div>
            {menuOpen && hasActions && onCloseMenu && <InventoryItemActionMenu anchorRef={triggerRef} onClose={onCloseMenu} onMove={onMove} onEquip={onEquip} onUnequip={onUnequip} onUse={onUse} onOpen={onOpen} onOpenBulk={onOpenBulk} onSplit={onSplit} onMerge={onMerge} onDiscard={onDiscard} splitDisabled={splitDisabled} openBulkDisabled={openBulkDisabled} />}
            {quantityOpen && quantityAction && item.type === "utility" && onConfirmQuantity && onCloseQuantity && (
                <ItemQuantityPopover
                    anchorRef={triggerRef}
                    maxQuantity={quantityAction === "split" ? item.cantidad - 1 : item.cantidad}
                    action={quantityAction}
                    onConfirm={onConfirmQuantity}
                    onClose={onCloseQuantity}
                />
            )}
            {isOpen && !suppressTooltip && hasDetails && (
                <InventoryTooltipPortal anchorRef={triggerRef} id={tooltipId}>
                    {item.type === "equip" && <EquipItemDetails item={item} character={character} />}
                    {item.type === "utility" && item.type_utility === "poción" && <PotionItemDetails item={item} />}
                    {item.type === "utility" && item.type_utility === "buff" && <BuffItemDetails item={item} />}
                    {item.type === "utility" && item.type_utility === "piedra" && <StoneItemDetails item={item} />}
                    {item.type === "utility" && item.type_utility === "caña" && <FishingRodItemDetails item={item} />}
                    {item.type === "utility" && item.type_utility === "cebo" && <BaitItemDetails item={item} />}
                    {item.type === "utility" && item.type_utility !== "poción" && item.type_utility !== "buff" && item.type_utility !== "piedra" && item.type_utility !== "caña" && item.type_utility !== "cebo" && <UtilityItemDetails item={item} />}
                </InventoryTooltipPortal>
            )}
        </>
    );
};
