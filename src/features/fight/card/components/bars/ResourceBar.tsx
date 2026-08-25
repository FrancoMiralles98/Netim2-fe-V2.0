export interface FightResourceBarProps {
    label: string;
    current: number;
    max: number;
    percent: number;
    type: 'hp' | 'mana';
}

export const FightResourceBar = ({
    label,
    current,
    max,
    percent,
    type
}: FightResourceBarProps) => {

    const barColor =
        type === 'hp'
            ? 'bg-red-500'
            : 'bg-blue-500';

    return (
        <div>
            <div
                className="
                    mb-1
                    flex
                    items-center
                    justify-between
                    text-xs
                "
            >
                <span className="font-medium text-slate-400">
                    {label}
                </span>

                <span className="text-slate-300">
                    {current} / {max}
                </span>
            </div>

            <div
                className="
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-slate-800
                "
            >
                <div
                    className={`
                        h-full
                        transition-[width]
                        duration-500
                        ease-out
                        ${barColor}
                    `}
                    style={{
                        width: `${Math.max(
                            0,
                            Math.min(100, percent)
                        )}%`
                    }}
                />
            </div>
        </div>
    );
};