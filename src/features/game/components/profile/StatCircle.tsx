import { useId, useState } from "react";
import { bonusFullNameByRef, type AttributesRefKeys, type BonusRefKeys } from "netim2-shared";
import { useCharacterSession } from "../../../characterSession/hooks/useCharacterSession";

interface StatCircleProps {
    stat: AttributesRefKeys;
    byLevel: number;
    byBonifications: number;
    showAvailablePointIcon?: boolean;
    onIncrease: (stat: AttributesRefKeys) => void;
    isIncreasePending?: boolean;
}

const STAT_CONFIG: Record<AttributesRefKeys, { image: string; pointIcon: string; textColor: string; titleColor: string; name: string }> = {
    VIT: { image: '/game/circulo-vit.png', pointIcon: '/game/icon-vit.png', textColor: 'text-rose-300', titleColor: 'text-rose-400', name: 'Vitalidad' },
    STR: { image: '/game/circulo-str.png', pointIcon: '/game/icon-str.png', textColor: 'text-violet-300', titleColor: 'text-violet-400', name: 'Fuerza' },
    INT: { image: '/game/circulo-int.png', pointIcon: '/game/icon-int.png', textColor: 'text-fuchsia-300', titleColor: 'text-fuchsia-400', name: 'Inteligencia' },
    DEX: { image: '/game/circulo-dex.png', pointIcon: '/game/icon-dex.png', textColor: 'text-emerald-300', titleColor: 'text-emerald-400', name: 'Destreza' },
};


const numberFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

const formatEffect = (stat: AttributesRefKeys, bonus: BonusRefKeys, value: number) =>
    `+${numberFormatter.format(value)}${stat === 'VIT' && bonus === 'hp' ? '%' : ''}`;

export const StatCircle = ({ stat, byBonifications, byLevel, showAvailablePointIcon = false, onIncrease, isIncreasePending = false }: StatCircleProps) => {
    const { gameConfig } = useCharacterSession();
    const [isCircleHovered, setIsCircleHovered] = useState(false);
    const [isPointIconHovered, setIsPointIconHovered] = useState(false);
    const { image, pointIcon, textColor, titleColor, name } = STAT_CONFIG[stat];
    const total = byLevel + byBonifications;
    const tooltipId = useId();
    const hideStatTooltip = showAvailablePointIcon && isPointIconHovered;
    const attributeCaps = gameConfig?.character.attributeCaps;
    const specialityCap = attributeCaps?.speciality?.[stat];
    const cap = specialityCap ?? attributeCaps?.race[stat];
    const capSource = specialityCap !== undefined ? "especialidad" : "raza";
    const hasReachedCap = cap !== undefined && byLevel >= cap;
    const effects = Object.entries(gameConfig?.attributes.effects[stat] ?? {}).filter(
        (entry): entry is [BonusRefKeys, number] => typeof entry[1] === 'number',
    );

    return (
        <div
            className="group relative w-[5rem] shrink-0 hover:z-50 focus-visible:z-50"
            role="group"
            tabIndex={0}
            aria-label={`${stat}: ${total}`}
            aria-describedby={hideStatTooltip ? undefined : tooltipId}
            onMouseEnter={() => setIsCircleHovered(true)}
            onMouseLeave={() => setIsCircleHovered(false)}
        >
            <img src={image} className="w-full" alt="" />
            <span className={`absolute inset-0  flex items-center justify-center text-[15px] font-serif drop-shadow-[0_1px_2px_#000] ${textColor}`} aria-hidden="true">
                {total}
            </span>
            {showAvailablePointIcon && (
                <button
                    type="button"
                    className={`absolute -right-[6px] bottom-0 z-10 h-[24px] w-[24px] border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e9cf99] ${hasReachedCap ? "cursor-not-allowed" : "cursor-pointer"}`}
                    title={hasReachedCap ? 'Cap máximo "Por nivel" alcanzado' : "Añadir 1 punto de atributo"}
                    aria-label={hasReachedCap ? `${name}: Cap máximo "Por nivel" alcanzado` : `Añadir 1 punto de ${name}`}
                    aria-disabled={isIncreasePending || hasReachedCap}
                    onMouseEnter={() => setIsPointIconHovered(true)}
                    onMouseLeave={() => setIsPointIconHovered(false)}
                    onFocus={() => setIsPointIconHovered(true)}
                    onBlur={() => setIsPointIconHovered(false)}
                    onClick={() => {
                        if (!isIncreasePending && !hasReachedCap) onIncrease(stat);
                    }}
                >
                    <img
                        src={pointIcon}
                        className={`pointer-events-none h-full w-full ${hasReachedCap ? "grayscale" : isCircleHovered ? "" : "motion-safe:animate-pulse"}`}
                        alt=""
                        aria-hidden="true"
                    />
                </button>
            )}
            <div
                id={tooltipId}
                role="tooltip"
                className={`pointer-events-none invisible absolute top-full left-1/2 z-50 mt-2 w-[250px] -translate-x-1/2 rounded border border-[#4a5356] bg-[#111715] p-3 text-[13px] text-white opacity-0 shadow-xl transition-opacity ${hideStatTooltip ? "" : "group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"}`}
            >
                <div className="flex items-center justify-between gap-4 font-semibold">
                    <span className={`text-[14px] ${titleColor}`}>{name} ({stat})</span>
                    <span>{numberFormatter.format(total)} {total === 1 ? 'punto' : 'puntos'}</span>
                </div>
                <div className="mt-3 space-y-2 border-t border-[#424b4f] pt-4">
                    <div>
                        <div className="flex justify-between gap-4"><span>Por nivel</span><span>{numberFormatter.format(byLevel)}</span></div>
                        {cap !== undefined && (
                            <p className="mt-1 text-[11px] italic text-gray-400">*Cap máximo por {capSource}: {numberFormatter.format(cap)} puntos.</p>
                        )}
                    </div>
                    <div className="flex justify-between gap-4"><span>Por bonificaciones</span><span>{numberFormatter.format(byBonifications)}</span></div>
                </div>

                <div className="mt-3 border-t border-[#424b4f] pt-4">
                    <p className="mb-2 font-semibold text-[#9ce6ed]">Beneficio por punto</p>
                    {effects.map(([bonus, amount]) => (
                        <div key={bonus} className="mt-1 flex justify-between gap-4">
                            <span>{bonusFullNameByRef(bonus)}</span>
                            <span className="shrink-0  text-emerald-200">{formatEffect(stat, bonus, amount)}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-3 border-t border-[#424b4f] pt-4">
                    <p className="mb-2 font-semibold text-[#9ce6ed]">Bonificación actual</p>
                    {effects.map(([bonus, amount]) => (
                        <div key={bonus} className="mt-1 flex justify-between gap-4">
                            <span>{bonusFullNameByRef(bonus)}</span>
                            <span className="shrink-0  text-emerald-200">{formatEffect(stat, bonus, amount * total)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
