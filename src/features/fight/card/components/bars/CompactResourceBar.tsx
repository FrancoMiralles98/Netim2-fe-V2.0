export interface CompactResourceBarProps {
    percent: number;
    type: 'hp' | 'mana';
}

export const CompactResourceBar = ({
    percent,
    type
}: CompactResourceBarProps) => {

    const barColor =
        type === 'hp'
            ? 'bg-red-500'
            : 'bg-blue-500';

    return (
        <div
            className="
                h-2
                w-full
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
                    width: `${
                        Math.max(
                            0,
                            Math.min(100, percent)
                        )
                    }%`
                }}
            />
        </div>
    );
};