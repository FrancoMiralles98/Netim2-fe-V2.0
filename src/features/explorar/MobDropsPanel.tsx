import type { GetMobInfoResponse } from "netim2-shared";
import { ItemBorderGlint, type ItemBorderGlintProps } from "../../shared/animations";
import { formatExperienceReward } from "../../shared/formatters/experience-reward";
import { MiniTooltip } from "../../shared/tooltip/components/MiniTooltip";
import { useCharacterSession } from "../characterSession/hooks/useCharacterSession";
import { InventoryItemTooltip } from "../inventory/components/InventoryItemTooltip";
import { InventoryItemVisual } from "../inventory/components/InventoryItemVisual";
import { INVENTORY_SLOT_SIZE } from "../inventory/inventory.constants";
import "./mob-drops-panel.css";

const chanceFormatter = new Intl.NumberFormat("es-AR", {
    style: "percent",
    maximumFractionDigits: 1,
});

const formatChancePerKill = (chance: number) =>
    chance > 0 && chance < 0.1 ? "<0,1 %" : chanceFormatter.format(chance / 100);

const rewardFormatter = new Intl.NumberFormat("es-AR");

type ItemDrop = Exclude<GetMobInfoResponse["drop"][number], { type: "yang" }>;

const dropGlintVariants: Partial<Record<ItemDrop["dropWeight"], ItemBorderGlintProps["variant"]>> = {
    VERY_RARE: "gold",
    ULTRA_RARE: "red",
};

const formatYang = (amount: number) =>
    amount >= 1000 ? `${Math.trunc(amount / 100) / 10}k` : rewardFormatter.format(amount);

const formatReward = (
    { min, max }: GetMobInfoResponse["mob"]["yang"],
    formatAmount: (amount: number) => string,
) => min === max ? formatAmount(min) : `${formatAmount(min)} – ${formatAmount(max)}`;

const DropChance = ({ chancePerKill, chanceChange, className = "" }: Pick<GetMobInfoResponse["drop"][number], "chancePerKill" | "chanceChange"> & { className?: string }) => {
    const chance = formatChancePerKill(chancePerKill);

    return (
        <p className={`mob-drops__chance relative text-center ${className}`} aria-label={`${chance} de probabilidad por baja`}>
            {chance}
            {chanceChange !== "unchanged" && (
                <span
                    className={`absolute -top-1 -right-1 text-[14px] leading-none font-bold drop-shadow-[0_1px_1px_#382010] ${chanceChange === "increased" ? "text-green-500" : "text-red-500"}`}
                    role="img"
                    aria-label={chanceChange === "increased" ? "Probabilidad aumentada" : "Probabilidad reducida"}
                >
                    {chanceChange === "increased" ? "↑" : "↓"}
                </span>
            )}
        </p>
    );
};

export const MobDropsPanel = ({ drop: drops, mob: { yang, exp, specific_drop } }: GetMobInfoResponse) => {
    const { character } = useCharacterSession();
    const yangDrop = drops.find((drop) => drop.type === "yang");
    const sortedDrops = drops.filter((drop): drop is ItemDrop => drop.type !== "yang")
        .sort((first, second) => first.chancePerKill - second.chancePerKill);
    const slotWidth = Math.max(1, ...sortedDrops.map(({ item }) => item.size.cols)) * INVENTORY_SLOT_SIZE + 16;
    const slotHeight = Math.max(3, ...sortedDrops.map(({ item }) => item.size.rows)) * INVENTORY_SLOT_SIZE + 32;
    const rewards = [
        { label: "Yang", icon: "/utils/yang-icon.png", amount: yang, formatAmount: formatYang, drop: yangDrop },
        {
            label: "EXP",
            icon: "/utils/exp-icon.png",
            amount: exp,
            formatAmount: (amount: number) => formatExperienceReward(amount, character?.exp_next_lv ?? 0),
            drop: undefined,
        },
    ];

    return (
        <section aria-label="Recompensas del enemigo" className="mob-drops relative flex flex-col">
            <div aria-hidden="true" className="mob-drops__frame">
                <span className="mob-drops__seal"><i /><i /><i /></span>
            </div>
            <div className="mob-drops__rewards flex shrink-0 items-center justify-center">
                {rewards.map(({ label, icon, amount, formatAmount, drop }) => (
                    <div key={label} className="mob-drops__reward relative flex items-center justify-center">
                        <img
                            src={icon}
                            alt={label}
                            className={`shrink-0 object-contain ${label === "Yang" ? "mob-drops__yang-icon" : ""}`}
                        />
                        <span>{formatReward(amount, formatAmount)}</span>
                        {drop && (
                            <div className="mob-drops__reward-chance">
                                <MiniTooltip text="Chances de obtener Yang">
                                    <DropChance {...drop} />
                                </MiniTooltip>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div aria-hidden="true" className="mob-drops__divider"><span /></div>
            {sortedDrops.length === 0 ? (
                <p className="pt-2 text-center text-sm font-semibold">Sin drops de ítems</p>
            ) : (
                <ul aria-label="Drops por baja" className="mob-drops__items custom-scrollbar flex min-h-0 flex-wrap content-start justify-center overflow-y-auto">
                    {sortedDrops.map((drop) => {
                        const { item } = drop;
                        const glintVariant = specific_drop.includes(item.idItem) ? "blue" : dropGlintVariants[drop.dropWeight];
                        const range = drop.type === "equip" ? drop.upgradeLvRange : drop.quantityRange;
                        const prefix = drop.type === "equip" ? "+" : "";
                        return (
                            <li key={item.idItem} className="mob-drops__item flex flex-col items-center">
                                <div className="mob-drops__slot relative isolate" style={{ width: slotWidth, height: slotHeight }}>
                                    <InventoryItemTooltip item={item} character={character ?? undefined}>
                                        <div className="mob-drops__visual relative grid place-items-center">
                                            <div style={{
                                                width: item.size.cols * INVENTORY_SLOT_SIZE,
                                                height: item.size.rows * INVENTORY_SLOT_SIZE,
                                            }}>
                                                <InventoryItemVisual item={item} showIndicators={false} />
                                            </div>
                                            {range && (
                                                <span className="pointer-events-none absolute inset-x-0 bottom-0.5 z-10 text-center text-[10px] leading-tight font-semibold text-amber-100 tabular-nums">
                                                    {prefix}{range.min} ~ {prefix}{range.max}
                                                </span>
                                            )}
                                        </div>
                                    </InventoryItemTooltip>
                                    {glintVariant && <ItemBorderGlint variant={glintVariant} radius={7} />}
                                </div>
                                <DropChance {...drop} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};
