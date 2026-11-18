import { useState } from "react";
import type { BonusRefKeys, MobType } from "netim2-shared";
import { bonusDisplayName, bonusValueColor, formatBonusValue, resolveStatBonusValue } from "../../shared/formatters/stat-bonus";

const categories = [
    { key: "daño", label: "Ataque" },
    { key: "defensa", label: "Defensa" },
    { key: "cc", label: "CC" },
] as const;

type Category = typeof categories[number]["key"];
const nameCollator = new Intl.Collator("es", { sensitivity: "base" });

export const MobBonusPanel = ({ stats }: { stats: MobType["stats"] }) => {
    const [category, setCategory] = useState<Category>("daño");
    const modifiers = (Object.entries(stats.bonus[category]) as [BonusRefKeys, number][])
        .map(([key, value]) => ({
            key,
            name: bonusDisplayName(key),
            value: resolveStatBonusValue(key, value, stats.general.va),
        }))
        .filter(({ value }) => value > 0 || value < 0)
        .sort((first, second) => nameCollator.compare(first.name, second.name));

    return (
        <section
            aria-label="Bonus del enemigo"
            className="flex h-64 w-full min-w-0 flex-col bg-[url('/game/marco-stats.png')] bg-[length:100%_100%] bg-no-repeat text-[#e9dcc6]"
        >
            <h4 className="flex h-8 shrink-0 items-center justify-center px-2 text-xs font-semibold text-[#e9cf99]">
                Bonus
            </h4>
            <div className="flex min-h-0 flex-1 flex-col px-3 pt-1 pb-3">
                <div role="group" aria-label="Tipos de bonus" className="grid grid-cols-3 gap-0.5">
                    {categories.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            aria-pressed={category === key}
                            onClick={() => setCategory(key)}
                            className={`cursor-pointer border border-[#6a4b2b] py-1 text-[11px] focus-visible:outline focus-visible:outline-amber-200 ${category === key
                                ? "bg-linear-to-b from-[#754819] via-[#422b13] to-[#24180e] text-[#ffe6a1] shadow-[inset_0_0_0_1px_#c18a3e]"
                                : "bg-black/35 hover:bg-[#513718]/70 hover:text-[#ffe6a1]"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div key={category} className="min-h-0 flex-1 overflow-y-auto px-1 py-1 text-[11px] leading-[17px] [scrollbar-color:#8e683b_#17120c] [scrollbar-width:thin]">
                    {modifiers.length > 0 ? (
                        <ul>
                            {modifiers.map(({ key, name, value }) => (
                                <li key={key} className="flex items-start justify-between gap-2 border-b border-[#8e683b]/20 py-0.5 last:border-b-0">
                                    <span className="min-w-0 wrap-break-word">{name}</span>
                                    <span className={`shrink-0 tabular-nums ${bonusValueColor(value)}`}>{formatBonusValue(key, value)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-[#e1d2b9]">Sin modificadores</p>
                    )}
                </div>
            </div>
        </section>
    );
};
