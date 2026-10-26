import type { PiedrasInItem } from "netim2-shared";
import { CorruptExplicitBonuses, ImplicitBonuses } from "./EquipBonusGroups";
import { getItemImagePath } from "../getItemImagePath";

interface EquipStoneSlotsProps {
    piedras: PiedrasInItem[];
    slot: number;
}

export const EquipStoneSlots = ({ piedras, slot }: EquipStoneSlotsProps) => {
    if (slot <= 0) return null;

    return (
        <div className="mt-5 flex flex-col gap-4 text-left text-[12px]">
            {Array.from({ length: slot }, (_, index) => {
                const piedra = piedras[index];

                return (
                    <div key={index} className="flex min-h-[34px] items-center gap-1">
                        <div className="relative h-[34px] w-[34px] shrink-0 bg-[url('/game/Slot_Piedra.png')] bg-center bg-no-repeat">
                            {piedra && (
                                <img
                                    src={getItemImagePath(piedra.idItem) ?? undefined}
                                    alt={piedra.name}
                                    className="absolute top-1/2 left-1/2 h-[32px] w-[32px] -translate-x-1/2 -translate-y-1/2 object-contain"
                                />
                            )}
                        </div>
                        {piedra ? (
                            <div className="min-w-0">
                                <p className="text-gray-200">{piedra.name} +{piedra.upgradeLv}</p>
                                <ImplicitBonuses bonuses={piedra.implicitBonus} />
                                <CorruptExplicitBonuses bonuses={piedra.corruptExplicitBonus} />
                            </div>
                        ) : (
                            <span className="text-gray-200">Vacio</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
