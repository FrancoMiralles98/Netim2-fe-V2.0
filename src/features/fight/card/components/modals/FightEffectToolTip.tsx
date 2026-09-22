import type { ReactNode } from 'react';

export  const FightEffectTooltip = ({
    children
}: {
    children: ReactNode;
}) => {
    return (
        <div
            className="
                pointer-events-none
                absolute
                bottom-full
                left-1/2
                z-50
                mb-2
                hidden
                w-48
                -translate-x-1/2
                rounded-md
                border
                border-slate-700
                bg-slate-950
                p-2.5
                text-xs
                text-slate-400
                shadow-xl

                group-hover:block
            "
        >
            {children}

            {/* Flechita */}
            <div
                className="
                    absolute
                    left-1/2
                    top-full
                    h-2
                    w-2
                    -translate-x-1/2
                    -translate-y-1/2
                    rotate-45
                    border-b
                    border-r
                    border-slate-700
                    bg-slate-950
                "
            />
        </div>
    );
};