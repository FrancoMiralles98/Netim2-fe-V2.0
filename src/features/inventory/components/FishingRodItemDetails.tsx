import type { CañaType } from "netim2-shared";

export const FishingRodItemDetails = ({ item }: { item: CañaType }) => (
    <section className="w-[200px] max-w-[calc(100vw-48px)] p-1 text-center">
        <h3 className="text-[14px] font-medium text-white">{item.name}</h3>
        {item.description?.trim() && (
            <p className="mt-2 whitespace-normal break-words text-[12px] leading-[17px] text-gray-200">
                {item.description}
            </p>
        )}
        <p className="mt-3 text-[12px] text-gray-200">
            Exp: <span className="text-orange-300">{item.exp}</span> / {item.expOfLv}
        </p>
        <p className="mt-3 text-[12px] text-gray-200">
            Habilidad de Pesca: <span className="text-emerald-300">+{item.pescaSkill}</span>
        </p>
    </section>
);
