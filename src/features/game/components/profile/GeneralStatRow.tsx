import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ICON_TINT_CLASS = {
    health: 'bg-red-700',
    mana: 'bg-cyan-500',
    healthRegen: 'bg-green-600',
    manaRegen: 'bg-sky-500',
    physicalDamage: 'bg-orange-400',
    magicalDamage: 'bg-blue-400',
} as const;

export interface GeneralStatDetail {
    label: string;
    value: string;
}

interface GeneralStatRowProps {
    icon?: string;
    iconTint?: keyof typeof ICON_TINT_CLASS;
    label: string;
    value: string | number;
    description: string;
    details?: GeneralStatDetail[];
    progress?: number;
    progressColor?: 'hp' | 'mana';
}

interface TooltipPosition {
    top: number;
    left: number;
}

export const GeneralStatRow = ({
    icon,
    iconTint,
    label,
    value,
    description,
    details = [],
    progress,
    progressColor = 'hp',
}: GeneralStatRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tooltipId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<TooltipPosition | null>(null);

    const updatePosition = useCallback(() => {
        const row = rowRef.current;
        const tooltip = tooltipRef.current;
        if (!row || !tooltip) return;

        const rowRect = row.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 8;
        const gap = 8;
        const right = rowRect.right + gap;
        const preferredLeft = right + tooltipRect.width + margin <= window.innerWidth
            ? right
            : rowRect.left - tooltipRect.width - gap;

        setPosition({
            left: Math.min(Math.max(preferredLeft, margin), Math.max(margin, window.innerWidth - tooltipRect.width - margin)),
            top: Math.min(Math.max(rowRect.top + rowRect.height / 2 - tooltipRect.height / 2, margin), Math.max(margin, window.innerHeight - tooltipRect.height - margin)),
        });
    }, []);

    useLayoutEffect(() => {
        if (!isOpen) return;

        updatePosition();
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, updatePosition]);

    const openTooltip = () => {
        setPosition(null);
        setIsOpen(true);
    };

    return (
        <>
            <div
                ref={rowRef}
                tabIndex={0}
                aria-describedby={isOpen ? tooltipId : undefined}
                onMouseEnter={openTooltip}
                onMouseLeave={() => setIsOpen(false)}
                onFocus={openTooltip}
                onBlur={() => setIsOpen(false)}
                className={`grid min-h-0 items-center gap-2 border-b border-white/15 text-[11px] text-[#d5d6d2] last:border-b-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e9cf99] ${progress !== undefined ? 'grid-cols-[18px_36px_minmax(0,1fr)_96px]' : 'grid-cols-[18px_minmax(0,1fr)_auto]'}`}
            >
                {icon ? (
                    iconTint ? (
                        <span
                            aria-hidden="true"
                            className={`block h-[16px] w-[18px] ${ICON_TINT_CLASS[iconTint]}`}
                            style={{
                                mask: `url("${icon}") center / contain no-repeat`,
                                WebkitMask: `url("${icon}") center / contain no-repeat`,
                            }}
                        />
                    ) : <img src={icon} className="max-h-[16px] max-w-[18px] object-contain" alt="" />
                ) : <span />}
                <div className={progress !== undefined ? 'contents' : 'flex min-w-0 items-center'}>
                    <span className="truncate">{label}</span>
                    {progress !== undefined && (
                        <span className="h-[7px] min-w-0 border border-[#5b6568] bg-[#1c2529] p-px">
                            <span
                                className={`block h-full bg-gradient-to-r ${progressColor === 'mana' ? 'from-[#1763a9] to-[#42a5e8]' : 'from-[#98262b] to-[#d43a3d]'}`}
                                style={{ width: `${progress}%` }}
                            />
                        </span>
                    )}
                </div>
                <span className="whitespace-nowrap text-right tabular-nums text-white">{value}</span>
            </div>
            {isOpen && createPortal(
                <div
                    ref={tooltipRef}
                    id={tooltipId}
                    role="tooltip"
                    className="pointer-events-none fixed z-[99999] max-h-[calc(100vh-16px)] w-[310px] max-w-[calc(100vw-16px)] overflow-y-auto rounded-sm border border-[#8e683b] bg-[#0b0b0b]/95 px-3 py-2 font-sans text-[12px] text-[#ddd5c9] shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
                    style={{
                        top: position?.top ?? 0,
                        left: position?.left ?? 0,
                        visibility: position ? 'visible' : 'hidden',
                    }}
                >
                    <p className="mb-1 font-semibold text-[#e9cf99]">{label}</p>
                    <p className="leading-relaxed">{description}</p>
                    {details.length > 0 && (
                        <div className="mt-2 space-y-1 border-t border-[#8e683b]/50 pt-2">
                            {details.map((detail) => (
                                <div key={detail.label} className="flex justify-between gap-3">
                                    <span>{detail.label}</span>
                                    <span className="shrink-0 text-white tabular-nums">{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>,
                document.body,
            )}
        </>
    );
};
