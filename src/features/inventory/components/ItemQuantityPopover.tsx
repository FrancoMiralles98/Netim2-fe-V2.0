import { useCallback, useLayoutEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { createPortal } from "react-dom";

interface ItemQuantityPopoverProps {
    anchorRef: RefObject<HTMLDivElement | null>;
    maxQuantity: number;
    action: "use" | "split" | "openBulk";
    onConfirm: (quantity: number) => void;
    onClose: () => void;
}

export const ItemQuantityPopover = ({ anchorRef, maxQuantity, action, onConfirm, onClose }: ItemQuantityPopoverProps) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [quantity, setQuantity] = useState(action === "openBulk" ? "2" : "1");
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const parsedQuantity = Number(quantity);
    const minQuantity = action === "openBulk" ? 2 : 1;
    const isValidQuantity = Number.isSafeInteger(parsedQuantity)
        && parsedQuantity >= minQuantity && parsedQuantity <= maxQuantity;
    const actionLabel = action === "split" ? "Dividir" : action === "openBulk" ? "Abrir" : "Usar";

    const updatePosition = useCallback(() => {
        const anchor = anchorRef.current;
        const popover = popoverRef.current;
        if (!anchor || !popover) return;

        const anchorRect = anchor.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();
        const margin = 8;
        const gap = 6;
        const right = anchorRect.right + gap;
        const preferredLeft = right + popoverRect.width + margin <= window.innerWidth
            ? right
            : anchorRect.left - popoverRect.width - gap;

        setPosition({
            left: Math.min(Math.max(preferredLeft, margin), Math.max(margin, window.innerWidth - popoverRect.width - margin)),
            top: Math.min(Math.max(anchorRect.top, margin), Math.max(margin, window.innerHeight - popoverRect.height - margin)),
        });
    }, [anchorRef]);

    useLayoutEffect(() => {
        updatePosition();
        inputRef.current?.focus();

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (anchorRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isValidQuantity) onConfirm(parsedQuantity);
    };

    return createPortal(
        <div
            ref={popoverRef}
            role="dialog"
            aria-label={action === "split" ? "Cantidad de ítems a dividir" : action === "openBulk" ? "Cantidad de cofres a abrir" : "Cantidad de pociones a usar"}
            className="fixed z-[100000] w-[180px] rounded-sm border border-[#8e683b] bg-[#0b0b0b]/95 p-2 font-sans text-[12px] text-[#e9cf99] shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
            style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? "visible" : "hidden",
            }}
        >
            <form onSubmit={handleSubmit}>
                <label htmlFor="item-action-quantity" className="block">Cantidad a {action === "split" ? "dividir" : action === "openBulk" ? "abrir" : "usar"} (máx. {maxQuantity})</label>
                <input
                    ref={inputRef}
                    id="item-action-quantity"
                    type="number"
                    min={minQuantity}
                    max={maxQuantity}
                    step={1}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="mt-1 w-full rounded-sm border border-[#8e683b] bg-black px-2 py-1 text-white outline-none focus:border-[#e9cf99]"
                />
                <div className="mt-2 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="cursor-pointer px-1 text-gray-300 hover:text-white">Cancelar</button>
                    <button type="submit" disabled={!isValidQuantity} className="cursor-pointer px-1 text-[#e9cf99] hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{actionLabel}</button>
                </div>
            </form>
        </div>,
        document.body,
    );
};
