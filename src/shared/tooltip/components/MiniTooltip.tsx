import type { ReactNode } from "react";

interface MiniTooltipProps {
    text: string;
    children: ReactNode;
    className?: string;
}

export const MiniTooltip = ({ text, children, className = '' }: MiniTooltipProps) => (
    <div
        className={`group relative inline-flex ${className}`}
        tabIndex={0}
        aria-label={text}
    >
        {children}
        <span
            role="tooltip"
            className="pointer-events-none invisible absolute top-full left-1/2 z-50 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 shadow-sm transition-opacity group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
        >
            {text}
        </span>
    </div>
);
