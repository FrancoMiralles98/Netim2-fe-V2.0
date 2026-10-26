import type { BonusInItem } from "netim2-shared";

interface BonusGroupProps {
    bonuses: BonusInItem[];
}

const formatBonusValue = (bonus: BonusInItem) => {
    const suffix = bonus.displayFormat === "porcentage" ? "%" : "";

    if (typeof bonus.bonusValue === "number") {
        const sign = bonus.bonusValue > 0 ? "+" : "";
        return `${sign}${bonus.bonusValue}${suffix}`;
    }

    return `${bonus.bonusValue.min}-${bonus.bonusValue.max}${suffix}`;
};

const isNegativeBonus = (bonus: BonusInItem) =>
    typeof bonus.bonusValue === "number"
        ? bonus.bonusValue < 0
        : bonus.bonusValue.min < 0 || bonus.bonusValue.max < 0;

const BonusGroup = ({ bonuses, color }: BonusGroupProps & { color: string }) => {
    if (bonuses.length === 0) return null;

    return (
        <div className={`space-y-1 ${color}`}>
            {bonuses.map((bonus, index) => {
                const negative = isNegativeBonus(bonus);

                return (
                    <p
                        key={`${bonus.bonusRef}-${index}`}
                        className={negative ? "text-red-300/75" : undefined}
                        style={negative ? { color: "oklch(80.8% 0.114 19.571 / 75%)" } : undefined}
                    >
                        {bonus.bonusFullName} {formatBonusValue(bonus)}
                    </p>
                );
            })}
        </div>
    );
};

// Las clases completas deben estar presentes en el código para que Tailwind las genere.
const implicitColor = "text-green-300/75";
const corruptImplicit = "text-red-600";
const corruptExplicit = "text-orange-600";
const explicitColor = "text-emerald-200";

export const ImplicitBonuses = ({ bonuses }: BonusGroupProps) => (
    <BonusGroup bonuses={bonuses} color={implicitColor} />
);

export const RandomImplicitBonuses = ({ bonuses }: BonusGroupProps) => (
    <BonusGroup bonuses={bonuses} color={implicitColor} />
);

export const CorruptImplicitBonuses = ({ bonuses }: BonusGroupProps) => (
    <BonusGroup bonuses={bonuses} color={corruptImplicit} />
);

export const ExplicitBonuses = ({ bonuses }: BonusGroupProps) => (
    <BonusGroup bonuses={bonuses} color={explicitColor} />
);

export const CorruptExplicitBonuses = ({ bonuses }: BonusGroupProps) => (
    <BonusGroup bonuses={bonuses} color={corruptExplicit} />
);

export const BonusSixSeven = ({ bonuses }: BonusGroupProps) => (
    <BonusGroup bonuses={bonuses} color="text-white" />
);
