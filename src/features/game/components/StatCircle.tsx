import { useId } from "react";
import { ATTRIBUTE_EFFECTS_CONFIG, bonusFullNameByRef, type AttributesRefKeys, type BonusRefKeys } from "netim2-shared";

interface StatCircleProps {
    stat: AttributesRefKeys;
    byLevel: number;
    byBonifications: number;
}

const STAT_CONFIG: Record<AttributesRefKeys, { image: string; textColor: string; titleColor: string; name: string }> = {
    VIT: { image: '/game/circulo-vit.png', textColor: 'text-rose-300', titleColor: 'text-rose-400', name: 'Vitalidad' },
    STR: { image: '/game/circulo-str.png', textColor: 'text-violet-300', titleColor: 'text-violet-400', name: 'Fuerza' },
    INT: { image: '/game/circulo-int.png', textColor: 'text-fuchsia-300', titleColor: 'text-fuchsia-400', name: 'Inteligencia' },
    DEX: { image: '/game/circulo-dex.png', textColor: 'text-emerald-300', titleColor: 'text-emerald-400', name: 'Destreza' },
};


const numberFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

const formatEffect = (stat: AttributesRefKeys, bonus: BonusRefKeys, value: number) =>
    `+${numberFormatter.format(value)}${stat === 'VIT' && bonus === 'hp' ? '%' : ''}`;

export const StatCircle = ({ stat, byBonifications, byLevel }: StatCircleProps) => {
    const { image, textColor, titleColor, name } = STAT_CONFIG[stat];
    const total = byLevel + byBonifications;
    const tooltipId = useId();
    const effects = Object.entries(ATTRIBUTE_EFFECTS_CONFIG[stat]).filter(
        (entry): entry is [BonusRefKeys, number] => typeof entry[1] === 'number',
    );

    return (
        <div
            className="group relative w-[5rem] shrink-0 hover:z-50 focus-visible:z-50"
            role="img"
            tabIndex={0}
            aria-label={`${stat}: ${total}`}
            aria-describedby={tooltipId}
        >
            <img src={image} className="w-full" alt="" />
            <span className={`absolute inset-0  flex items-center justify-center text-[15px] font-serif drop-shadow-[0_1px_2px_#000] ${textColor}`} aria-hidden="true">
                {total}
            </span>
            <div
                id={tooltipId}
                role="tooltip"
                className="pointer-events-none invisible absolute top-full left-1/2 z-50 mt-2 w-[250px] -translate-x-1/2 rounded border border-[#4a5356] bg-[#111715] p-3 text-[13px] text-white opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
            >
                <div className="flex items-center justify-between gap-4 font-semibold">
                    <span className={`text-[14px] ${titleColor}`}>{name} ({stat})</span>
                    <span>{numberFormatter.format(total)} {total === 1 ? 'punto' : 'puntos'}</span>
                </div>
                <div className="mt-3 space-y-2 border-t border-[#424b4f] pt-4">
                    <div className="flex justify-between gap-4"><span>Por nivel</span><span>{numberFormatter.format(byLevel)}</span></div>
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
