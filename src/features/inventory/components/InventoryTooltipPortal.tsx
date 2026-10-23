import { useCallback, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

const CORNERS = [
    { src: "/utils/AI_vistanativa.png", className: "top-0 left-0" },
    { src: "/utils/AD_vistanativa.png", className: "top-0 right-0" },
    { src: "/utils/BI_border.png", className: "bottom-0 left-0" },
    { src: "/utils/BD_border.png", className: "bottom-0 right-0" },
] as const;

interface InventoryTooltipPortalProps {
    anchorRef: RefObject<HTMLElement | null>;
    id: string;
    children: ReactNode;
}

export const InventoryTooltipPortal = ({ anchorRef, id, children }: InventoryTooltipPortalProps) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    const updatePosition = useCallback(() => {
        const trigger = anchorRef.current;
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
    }, [anchorRef]);

    useLayoutEffect(() => {
        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [updatePosition]);

    return createPortal(
        <div
            ref={tooltipRef}
            id={id}
            role="tooltip"
            className="pointer-events-none fixed z-[99999] max-h-[calc(100vh-16px)] min-w-[200px] max-w-[calc(100vw-16px)] overflow-y-auto border border-white/10 bg-black/95 px-3 py-2 text-center font-sans text-white shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
            style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? "visible" : "hidden",
            }}
        >
            {CORNERS.map(({ src, className }) => (
                <img key={src} src={src} alt="" aria-hidden="true" className={`absolute h-[10px] w-[10px] ${className}`} />
            ))}
            {children}
        </div>,
        document.body,
    );
};
