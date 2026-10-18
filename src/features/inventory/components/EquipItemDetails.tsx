import type { CharacterSession, EquipType } from "netim2-shared";
import {
    BonusSixSeven,
    CorruptExplicitBonuses,
    CorruptImplicitBonuses,
    ExplicitBonuses,
    ImplicitBonuses,
    RandomImplicitBonuses,
} from "./EquipBonusGroups";
import { EquipStoneSlots } from "./EquipStoneSlots";

type CharacterRequirements = Pick<CharacterSession, "lv" | "raza">;

const priceFormatter = new Intl.NumberFormat("es-AR");
const RACE_NAMES = {
    guerrero: "Guerrero",
    ninja: "Ninja",
    sura: "Sura",
    chaman: "Chamán",
} as const;

export const EquipItemDetails = ({ item, character }: { item: EquipType; character?: CharacterRequirements }) => {
    const isCompatible = !character || (character.lv >= item.lvReq
        && (item.restricted.length === 0 || item.restricted.includes(character.raza)));
    const hasBonuses = item.implicitBonus.length > 0
        || item.randomImplicitBonus.length > 0
        || item.corruptImplicitBonus.length > 0
        || item.explicitBonus.length > 0
        || item.corruptExplicitBonus.length > 0
        || item.bonus6_7.length > 0;

    return (
        <section className={isCompatible ? "p-1" : "inventory-item-tooltip--incompatible p-1 text-red-400"}>
            <h3 className="text-[14px] font-medium text-white">
                {item.name}{item.upgradeLv > 0 ? ` +${item.upgradeLv}` : ""}
            </h3>
            <p className="text-[11px] pt-1" style={{ color: "#d9d9d9" }}>Desde el nivel: {item.lvReq}</p>
            <p className="text-[11px] pt-1" style={{ color: "#d9d9d9" }}>Item level: {item.itemLv}</p>

            {hasBonuses && (
                <div className="mt-2 space-y-2 text-[12px] leading-[16px]">
                    <ImplicitBonuses bonuses={item.implicitBonus} />
                    <RandomImplicitBonuses bonuses={item.randomImplicitBonus} />
                    <CorruptImplicitBonuses bonuses={item.corruptImplicitBonus} />
                    <ExplicitBonuses bonuses={item.explicitBonus} />
                    <BonusSixSeven bonuses={item.bonus6_7} />
                    <CorruptExplicitBonuses bonuses={item.corruptExplicitBonus} />
                </div>
            )}

            <p className="mt-3 text-[14px] text-gray-200/80">[ Equipable ]</p>
            {item.restricted.length > 0 && (
                <p className="mt-1 text-[12px] text-gray-200/80">
                    {item.restricted.map((race) => RACE_NAMES[race]).join(" ")}
                </p>
            )}
            <EquipStoneSlots piedras={item.piedras} slot={item.slot} />

            <p className="mt-4 flex items-center justify-center gap-1 text-[12px] !text-gray-200/80">
                Precio: <span className="!text-yellow-300">{priceFormatter.format(item.price)}</span>
                <img src="/utils/yang-icon.png" alt="Yang" className="h-[12px] w-[12px] object-contain" />
            </p>
        </section>
    );
};
