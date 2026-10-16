import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { CharacterSession, InventoryItem } from "netim2-shared";
import { InventoryItemActionMenu } from "./InventoryItemActionMenu";
import { EquipItemDetails } from "./EquipItemDetails";

type CharacterRequirements = Pick<CharacterSession, "lv" | "raza">;

const CORNERS = [
    { src: "/utils/AI_vistanativa.png", className: "top-0 left-0" },
    { src: "/utils/AD_vistanativa.png", className: "top-0 right-0" },
    { src: "/utils/BI_border.png", className: "bottom-0 left-0" },
    { src: "/utils/BD_border.png", className: "bottom-0 right-0" },
] as const;

interface InventoryItemTooltipProps {
    item: InventoryItem;
    character: CharacterRequirements;
    children: ReactNode;
    menuOpen: boolean;
    suppressTooltip: boolean;
    onToggleMenu: () => void;
    onCloseMenu: () => void;
    onMove: () => void;
}

interface TooltipPosition {
    top: number;
    left: number;
}

export const InventoryItemTooltip = ({
    item,
    character,
    children,
    menuOpen,
    suppressTooltip,
    onToggleMenu,
    onCloseMenu,
    onMove,
}: InventoryItemTooltipProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tooltipId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<TooltipPosition | null>(null);

    const updatePosition = useCallback(() => {
        const trigger = triggerRef.current;
        const tooltip = tooltipRef.current;
        if (!trigger || !tooltip) return;

        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 8;
        const gap = 8;
        const maxLeft = Math.max(margin, window.innerWidth - tooltipRect.width - margin);
        const left = Math.min(
            Math.max(triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2, margin),
            maxLeft,
        );
        const above = triggerRect.top - tooltipRect.height - gap;
        const below = triggerRect.bottom + gap;
        const preferredTop = above >= margin ? above : below;
        const maxTop = Math.max(margin, window.innerHeight - tooltipRect.height - margin);
        const top = Math.min(Math.max(preferredTop, margin), maxTop);

        setPosition({ top, left });
    }, []);

    useLayoutEffect(() => {
        if (!isOpen || item.type !== "equip") return;

        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen, item.type, updatePosition]);

    const openTooltip = () => {
        if (item.type !== "equip" || suppressTooltip) return;
        setPosition(null);
        setIsOpen(true);
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e9cf99]"
                role="button"
                tabIndex={0}
                aria-label={`Acciones de ${item.name}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-describedby={isOpen && !suppressTooltip && item.type === "equip" ? tooltipId : undefined}
                onMouseEnter={openTooltip}
                onMouseLeave={() => setIsOpen(false)}
                onFocus={openTooltip}
                onBlur={() => setIsOpen(false)}
                onClick={() => {
                    setIsOpen(false);
                    onToggleMenu();
                }}
                onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    setIsOpen(false);
                    onToggleMenu();
                }}
            >
                {children}
            </div>
            {menuOpen && <InventoryItemActionMenu anchorRef={triggerRef} onClose={onCloseMenu} onMove={onMove} />}
            {isOpen && !suppressTooltip && item.type === "equip" && createPortal(
                <div
                    ref={tooltipRef}
                    id={tooltipId}
                    role="tooltip"
                    className="pointer-events-none fixed z-[99999] max-h-[calc(100vh-16px)] min-w-[200px]  max-w-[calc(100vw-16px)] overflow-y-auto border border-white/10 bg-black/95 px-3 py-2 text-center font-sans text-white shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
                    style={{
                        top: position?.top ?? 0,
                        left: position?.left ?? 0,
                        visibility: position ? "visible" : "hidden",
                    }}
                >
                    {CORNERS.map(({ src, className }) => (
                        <img key={src} src={src} alt="" aria-hidden="true" className={`absolute h-[10px] w-[10px] ${className}`} />
                    ))}
                    <EquipItemDetails item={item} character={character} />
                </div>,
                document.body,
            )}
        </>
    );
};
