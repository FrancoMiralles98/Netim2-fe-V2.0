import { bonusFullNameByRef, type BonusRefKeys } from "netim2-shared";

export const bonusValueColor = (value: number) =>
    value > 0 ? "text-emerald-300" : value < 0 ? "text-red-200" : "text-gray-300";

export const bonusDisplayName = (key: BonusRefKeys) => {
    if (key === "desmayo") return "Prob de Desmayo";
    if (key === "daño_critico") return "Daño crítico";
    return bonusFullNameByRef(key);
};

export const formatBonusValue = (key: BonusRefKeys, value: number, showPlus = false) =>
    key === "daño_critico"
        ? `x${value.toFixed(1)}`
        : `${showPlus && value > 0 ? "+" : ""}${value}%`;

export const resolveStatBonusValue = (key: BonusRefKeys, value: number, attackSpeed: number) =>
    key === "doble_golpe" ? Math.max(0, attackSpeed) : value;
