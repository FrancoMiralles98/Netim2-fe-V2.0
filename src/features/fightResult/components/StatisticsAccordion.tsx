import { useId, useState, type ReactNode } from "react";

export interface StatisticsAccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export const StatisticsAccordion = ({
    title,
    children,
    defaultOpen = false
}: StatisticsAccordionProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const contentId = useId();

    return (
        <section
            className="
                overflow-hidden
                rounded-lg
                border
                border-slate-700
                bg-slate-950/60
            "
        >
            <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpen(current => !current)}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-3
                    py-2
                    text-left
                    text-sm
                    font-semibold
                    text-slate-100
                    transition-colors
                    hover:bg-slate-800/70
                "
            >
                <span>{title}</span>
                <span
                    aria-hidden="true"
                    className={`
                        text-xs
                        text-slate-400
                        transition-transform
                        duration-200
                        ${open ? 'rotate-180' : ''}
                    `}
                >
                    ▼
                </span>
            </button>

            <div
                id={contentId}
                className={`
                    grid
                    transition-[grid-template-rows]
                    duration-200
                    ease-out
                    ${open
                        ? 'grid-rows-[1fr]'
                        : 'grid-rows-[0fr]'
                    }
                `}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-slate-800 p-3">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};
