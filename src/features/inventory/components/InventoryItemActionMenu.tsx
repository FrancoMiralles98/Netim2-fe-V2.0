import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

interface InventoryItemActionMenuProps {
    anchorRef: RefObject<HTMLDivElement | null>;
    onClose: () => void;
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
}

interface MenuPosition {
    top: number;
    left: number;
}

export const InventoryItemActionMenu = ({ anchorRef, onClose, onMove, onEquip, onUnequip, onUse, onOpen, onOpenBulk, onSplit, onMerge, onDiscard, splitDisabled = false, openBulkDisabled = false }: InventoryItemActionMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const hasFocusedRef = useRef(false);
    const [position, setPosition] = useState<MenuPosition | null>(null);

    const updatePosition = useCallback(() => {
        const anchor = anchorRef.current;
        const menu = menuRef.current;
        if (!anchor || !menu) return;

        const anchorRect = anchor.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const margin = 8;
        const gap = 6;
        const right = anchorRect.right + gap;
        const preferredLeft = right + menuRect.width + margin <= window.innerWidth
            ? right
            : anchorRect.left - menuRect.width - gap;

        setPosition({
            left: Math.min(Math.max(preferredLeft, margin), Math.max(margin, window.innerWidth - menuRect.width - margin)),
            top: Math.min(Math.max(anchorRect.top, margin), Math.max(margin, window.innerHeight - menuRect.height - margin)),
        });
    }, [anchorRef]);

    useLayoutEffect(() => {
        updatePosition();

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (anchorRef.current?.contains(target) || menuRef.current?.contains(target)) return;
            onClose();
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            onClose();
            anchorRef.current?.focus();
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [anchorRef, onClose, updatePosition]);

    useLayoutEffect(() => {
        if (!position || hasFocusedRef.current) return;
        menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
        hasFocusedRef.current = true;
    }, [position]);

    return createPortal(
        <div
            ref={menuRef}
            role="menu"
            aria-label="Acciones del ítem"
            className="fixed z-[100000] min-w-[120px] max-w-[calc(100vw-16px)] rounded-sm border border-[#8e683b] bg-[#0b0b0b]/95 p-1 font-sans text-[13px] text-[#e9cf99] shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
            style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? "visible" : "hidden",
            }}
        >
            {onMove && (
                <button
                    type="button"
                    role="menuitem"
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none"
                    onClick={onMove}
                >
                    Mover
                </button>
            )}
            {onEquip && (
                <button
                    type="button"
                    role="menuitem"
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none"
                    onClick={onEquip}
                >
                    Equipar
                </button>
            )}
            {onUnequip && (
                <button
                    type="button"
                    role="menuitem"
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none"
                    onClick={onUnequip}
                >
                    Desequipar
                </button>
            )}
            {onUse && (
                <button
                    type="button"
                    role="menuitem"
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none"
                    onClick={onUse}
                >
                    Usar
                </button>
            )}
            {onOpen && (
                <button
                    type="button"
                    role="menuitem"
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none"
                    onClick={onOpen}
                >
                    Abrir
                </button>
            )}
            {onOpenBulk && (
                <button
                    type="button"
                    role="menuitem"
                    disabled={openBulkDisabled}
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    onClick={onOpenBulk}
                >
                    Abrir muchos
                </button>
            )}
            {onSplit && (
                <button
                    type="button"
                    role="menuitem"
                    disabled={splitDisabled}
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    onClick={onSplit}
                >
                    Dividir
                </button>
            )}
            {onMerge && (
                <button
                    type="button"
                    role="menuitem"
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left hover:bg-[#8e683b]/30 focus-visible:bg-[#8e683b]/30 focus-visible:outline-none"
                    onClick={onMerge}
                >
                    Agrupar
                </button>
            )}
            {onDiscard && (
                <button
                    type="button"
                    role="menuitem"
                    className="block w-full cursor-pointer rounded-sm px-3 py-1.5 text-left text-red-200 hover:bg-red-900/40 focus-visible:bg-red-900/40 focus-visible:outline-none"
                    onClick={onDiscard}
                >
                    Deshacer
                </button>
            )}
        </div>,
        document.body,
    );
};
