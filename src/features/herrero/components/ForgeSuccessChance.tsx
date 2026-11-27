import { useId } from "react";

const formatter = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export const ForgeSuccessChance = ({ chance }: { chance: number }) => {
    const id = useId();
    const tone = chance >= 70 ? "high" : chance >= 40 ? "medium" : "low";

    return (
        <div className="forge-success-chance" data-tone={tone}>
            <span className="forge-success-chance__label">Éxito</span>
            <div className="forge-success-chance__value">
                <svg aria-hidden="true" viewBox="0 0 240 100" preserveAspectRatio="none" className="forge-success-chance__brush">
                    <defs>
                        <linearGradient id={`${id}-ink`} x1="0" y1="1" x2="1" y2="0">
                            <stop stopColor="var(--ink-secondary)" />
                            <stop offset=".5" stopColor="var(--ink-primary)" />
                            <stop offset="1" stopColor="var(--ink-highlight)" />
                        </linearGradient>
                        <filter id={`${id}-rough`} x="-5%" y="-15%" width="110%" height="130%">
                            <feTurbulence type="fractalNoise" baseFrequency=".12 .55" numOctaves="3" seed="8" result="grain" />
                            <feDisplacementMap in="SourceGraphic" in2="grain" scale="4" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                        <mask id={`${id}-bristles`}>
                            <rect width="240" height="100" fill="white" />
                            <path d="M8 47 211 19M25 69 238 40M0 80 197 55M47 88 228 67M14 38 128 20M105 80 235 59" stroke="black" strokeWidth="1.5" />
                            <path d="m7 61 65-14M173 35l57-11M22 76l62-11M152 75l75-15" stroke="black" strokeWidth="3" />
                        </mask>
                    </defs>
                    <g fill={`url(#${id}-ink)`} filter={`url(#${id}-rough)`} mask={`url(#${id}-bristles)`}>
                        <path d="m19 43 32-16 104-8-22 6 88-6-32 10 43-3-9 12 13 1-14 11 8 4-28 13-105 18-74 3 15-6-26 1 7-10-11 1 8-12-7-2Z" />
                        <path d="m36 25 78-9-47 12 104-12-58 13-83 11Z" opacity=".75" />
                        <path d="m18 77 108-12 91-14-18 11-89 19-80 9 48-10-63 6Z" opacity=".8" />
                        <path d="m57 90 136-21-63 17-82 7ZM152 18l78-8-61 13ZM18 48l37-13-29 21Z" opacity=".5" />
                    </g>
                </svg>
                <strong>{formatter.format(chance)}<span>%</span></strong>
            </div>
        </div>
    );
};
