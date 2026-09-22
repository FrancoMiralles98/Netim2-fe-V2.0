export interface LiquidResourceIndicatorProps {
    current: number;
    max: number;
    variant: 'hp' | 'mana';
}

const getResourcePercentage = (
    current: number,
    max: number
): number => {
    if (
        !Number.isFinite(current) ||
        !Number.isFinite(max) ||
        max <= 0
    ) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, (current / max) * 100)
    );
};

export const LiquidResourceIndicator = ({
    current,
    max,
    variant
}: LiquidResourceIndicatorProps) => {
    const percentage = getResourcePercentage(
        current,
        max
    );
    const roundedPercentage = Math.round(percentage);
    const isHp = variant === 'hp';

    return (
        <div
            aria-label={`${isHp ? 'Vida' : 'Maná'}: ${roundedPercentage}%`}
            className={`
                relative
                h-12
                w-12
                shrink-0
                overflow-hidden
                rounded-full
                border
                bg-slate-950
                shadow-inner
                ${isHp
                    ? 'border-red-900'
                    : 'border-blue-900'
                }
            `}
        >
            <div
                className={`
                    absolute
                    bottom-0
                    left-0
                    w-full
                    transition-[height]
                    duration-500
                    ease-out
                    ${isHp
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }
                `}
                style={{ height: `${percentage}%` }}
            >
                {percentage > 0 && (
                    <div className="h-px w-full bg-white/35" />
                )}
            </div>

            <span
                className="
                    absolute
                    inset-0
                    z-10
                    flex
                    items-center
                    justify-center
                    text-[11px]
                    font-bold
                    text-white
                    [text-shadow:0_1px_3px_rgb(0_0_0/0.95)]
                "
            >
                {roundedPercentage}%
            </span>
        </div>
    );
};
