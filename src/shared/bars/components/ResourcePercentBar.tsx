import { MiniTooltip } from "../../tooltip/components/MiniTooltip";

interface ResourcePercentBarProps {
    current: number;
    max: number;
    variant: 'hp' | 'mana';
}

const RESOURCE_STYLES = {
    hp: { label: 'Vida', fill: 'bg-red-600' },
    mana: { label: 'Maná', fill: 'bg-blue-600' },
} as const;

export const ResourcePercentBar = ({ current, max, variant }: ResourcePercentBarProps) => {
    const percentage = max > 0
        ? Math.min(100, Math.max(0, Math.round((current / max) * 100)))
        : 0;
    const { label, fill } = RESOURCE_STYLES[variant];

    return (
        <MiniTooltip text={`${label}: ${current} / ${max}`} className="w-full">
            <div
                className="relative h-3 w-full overflow-hidden rounded-sm border border-amber-200/50 bg-black/70"
                role="progressbar"
                aria-label={label}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className={`h-full transition-[width] duration-300 ${fill}`}
                    style={{ width: `${percentage}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white [text-shadow:0_1px_2px_#000]">
                    {percentage}%
                </span>
            </div>
        </MiniTooltip>
    );
};
