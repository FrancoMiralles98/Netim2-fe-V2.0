import { useState } from "react";
import { bonusFullNameByRef, type BonusRefKeys, type CharacterSession } from "netim2-shared";
import { getBonusDescription } from "../../../shared/tooltip/utils/bonus-info-tool-tip";

type BonusCategory = keyof CharacterSession["stats"]["bonus"];

const BONUS_CATEGORIES: { key: BonusCategory; label: string }[] = [
    { key: "daño", label: "Ataque" },
    { key: "defensa", label: "Defensa" },
    { key: "cc", label: "CC" },
    { key: "miscs", label: "Miscs" },
];

const bonusNameCollator = new Intl.Collator("es", { sensitivity: "base" });

const bonusValueColor = (value: number) =>
    value > 0 ? "text-emerald-300" : value < 0 ? "text-red-200" : "text-gray-300";

const bonusDisplayName = (bonusRefKey: BonusRefKeys) => {
    if (bonusRefKey === "desmayo") return "Prob de Desmayo";
    if (bonusRefKey === "daño_critico") return "Daño crítico";
    return bonusFullNameByRef(bonusRefKey);
};

const formatBonusValue = (bonusRefKey: BonusRefKeys, value: number, showPlus = false) =>
    bonusRefKey === "daño_critico"
        ? `x${value.toFixed(1)}`
        : `${showPlus && value > 0 ? "+" : ""}${value}%`;

interface BonusPanelProps {
    character: CharacterSession;
}

export const BonusPanel = ({ character }: BonusPanelProps) => {
    const [activeCategory, setActiveCategory] = useState<BonusCategory>("daño");
    const [selectedBonus, setSelectedBonus] = useState<BonusRefKeys | null>(null);

    const bonuses = (Object.entries(character.stats.bonus[activeCategory]) as [BonusRefKeys, number][])
        .map(([bonusRefKey, value]): [BonusRefKeys, number] => [
            bonusRefKey,
            bonusRefKey === "doble_golpe" ? Math.max(0, character.stats.general.va) : value,
        ])
        .sort(([firstKey], [secondKey]) =>
            bonusNameCollator.compare(bonusDisplayName(firstKey), bonusDisplayName(secondKey))
        );
    const splitAt = Math.ceil(bonuses.length / 2);
    const columns = [bonuses.slice(0, splitAt), bonuses.slice(splitAt)];
    const selectedValue = bonuses.find(([bonusRefKey]) => bonusRefKey === selectedBonus)?.[1];

    return (
        <section
            id="bonus"
            aria-label="Bonus del personaje"
            className="h-full min-h-0 min-w-0 flex-1 bg-[url('/game/marco-bonus-exterior.png')] bg-[length:100%_100%] bg-no-repeat text-[#e9dcc6]"
        >
            <h2 className="flex h-[16%] items-center justify-center text-[13px] font-semibold text-[#f1cd79]">
                Bonus
            </h2>
            <div className="grid h-[84%] min-h-0 grid-rows-[12%_minmax(0,1fr)_17.5%] px-[3.4%] pb-[2.5%]">
                <div className="grid grid-cols-4 gap-1" role="tablist" aria-label="Tipos de bonus">
                    {BONUS_CATEGORIES.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === key}
                            onClick={() => {
                                setActiveCategory(key);
                                setSelectedBonus(null);
                            }}
                            className={`border border-[#6a4b2b] text-[12px] leading-none transition-colors ${activeCategory === key
                                ? "bg-gradient-to-b from-[#754819] via-[#422b13] to-[#24180e] text-[#ffe6a1] shadow-[inset_0_0_0_1px_#c18a3e]"
                                : "bg-black/35 text-[#e1d2b9] hover:bg-[#513718]/70 hover:text-[#ffe6a1]"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div
                    role="tabpanel"
                    className="min-h-0 overflow-y-auto border-x border-[#6a4b2b]/70 px-1 py-1 text-[11px] leading-[17px]"
                    style={{ scrollbarColor: "#8e683b #17120c", scrollbarWidth: "thin" }}
                >
                    <div className="grid grid-cols-2 gap-x-2">
                        {columns.map((column, index) => (
                            <div key={index} className="min-w-0">
                                {column.map(([bonusRefKey, value]) => (
                                    <button
                                        key={bonusRefKey}
                                        type="button"
                                        aria-pressed={selectedBonus === bonusRefKey}
                                        onClick={() => setSelectedBonus(bonusRefKey)}
                                        className={`flex h-[17px] w-full min-w-0 items-center justify-between gap-1 border-b border-[#8e683b]/20 px-1 text-left hover:bg-[#6d481d]/55 ${selectedBonus === bonusRefKey
                                            ? "bg-[#714819]/75 text-[#ffe4a0] ring-1 ring-inset ring-[#ba8338]"
                                            : "text-[#e6dccb]"}`}
                                    >
                                        <span className="min-w-0 truncate" title={bonusDisplayName(bonusRefKey)}>
                                            {bonusDisplayName(bonusRefKey)}
                                        </span>
                                        <span className={`shrink-0 tabular-nums ${bonusValueColor(value)}`}>{formatBonusValue(bonusRefKey, value)}</span>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="min-h-0 border-t border-[#a97735] bg-gradient-to-b from-[#281a0d]/80 to-black/40 px-3 py-0.5">
                    {selectedBonus !== null && selectedValue !== undefined && (
                        <>
                            <div className="flex items-baseline justify-between gap-2 text-[11px]  text-[#f4c765]">
                                <span className="min-w-0 truncate font-semibold">{bonusDisplayName(selectedBonus)}</span>
                                <span className={`shrink-0 tabular-nums ${bonusValueColor(selectedValue)}`}>{formatBonusValue(selectedBonus, selectedValue, true)}</span>
                            </div>
                            <p className="line-clamp-2 text-[11px] leading-[13px] text-[#ddd5c9]">
                                {getBonusDescription(selectedBonus)}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
