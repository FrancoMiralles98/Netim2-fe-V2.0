import type { EquipType, subTypeEquip } from "netim2-shared";
import { InventoryItemTooltip } from "../../inventory/components/InventoryItemTooltip";
import { INVENTORY_SLOT_SIZE } from "../../inventory/inventory.constants";

interface CharacterEquipmentPanelProps {
    equipo: EquipType[];
}

// Las ranuras ubican el centro de cada ítem sobre el fondo de 200 × 300.
// El tamaño del ítem se mantiene en píxeles, independiente del tamaño del fondo.
const EQUIPMENT_POSITIONS = {
    arma: { left: 7, top: 0, width: 36, height: 100 },
    casco: { left: 54, top: 8, width: 37, height: 47 },
    collar: { left: 154, top: 114, width: 38, height: 47 },
    armadura: { left: 58, top: 61, width: 37, height: 98 },
    escudo: { left: 101, top: 61, width: 38, height: 47 },
    pendiente: { left: 151, top: 61, width: 38, height: 47 },
    brazalete: { left: 101, top: 113, width: 38, height: 47 },
    botas: { left: 7, top: 165, width: 36, height: 48 },
} satisfies Record<subTypeEquip, { left: number; top: number; width: number; height: number }>;

export const CharacterEquipmentPanel = ({ equipo }: CharacterEquipmentPanelProps) => (
    <div id="equipo" className="flex aspect-[9/14] w-[19%] shrink-0 flex-col bg-[url('/game/marco-equipo.png')] bg-[length:100%_100%] bg-no-repeat px-2">
        <p className="flex h-[9%] pt-1 shrink-0 items-center b justify-center text-[12px] font-semibold text-[#e9cf99]">Equipo</p>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="relative h-[231px] w-[154px] shrink-0">
                <img src="/game/equipo.png" className="block h-full w-full" alt="" />
                {equipo.map((item) => {
                    const position = EQUIPMENT_POSITIONS[item.sub_type_equip];
                    return (
                        <div
                            key={item.sub_type_equip}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${(position.left + position.width / 2) / 200 * 100}%`,
                                top: `${(position.top + position.height / 2) / 300 * 100}%`,
                                width: item.size.cols * INVENTORY_SLOT_SIZE,
                                height: item.size.rows * INVENTORY_SLOT_SIZE,
                            }}
                        >
                            <InventoryItemTooltip item={item}>
                                <img src={item.img} alt={item.name} className="h-full w-full object-contain" />
                            </InventoryItemTooltip>
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="flex h-[16%] shrink-0 flex-col items-center justify-center gap-1 border-t border-[#8e683b]/70 px-1 pb-[0.5rem]">
            <p className="text-center text-[11px] font-semibold text-[#e9cf99]">Ranuras de equipo</p>
            <div className="flex w-full items-center justify-center gap-1">
                <img src="/game/bottom_equipo1.png" className="w-[32%]" alt="Ranura de equipo 1" />
                <img src="/game/bottom_equipo2.png" className="w-[32%]" alt="Ranura de equipo 2" />
                <img src="/game/bottom_equipo3.png" className="w-[32%]" alt="Ranura de equipo 3" />
            </div>
        </div>
    </div>
);
