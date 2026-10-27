import { useState } from "react";
import type { CharacterSession, EquipType, subTypeEquip } from "netim2-shared";
import { InventoryItemTooltip } from "../../inventory/components/InventoryItemTooltip";
import { INVENTORY_SLOT_SIZE } from "../../inventory/inventory.constants";
import { useCharacterSession } from "../../characterSession/hooks/useCharacterSession";
import { useUserSession } from "../../userSession/hook/useUserSession";
import { useModal } from "../../../shared/modal/hooks/useModal";
import { useEquipmentActions } from "../hooks/useEquipmentActions";
import { getItemImagePath } from "../../inventory/getItemImagePath";
import { ItemCorruptionSmoke, ItemStaticSparkles, ItemUpgradeSparkles } from "../../../shared/animations";
import { EquipSlotIndicators } from "../../inventory/components/EquipSlotIndicators";

interface CharacterEquipmentPanelProps {
    equipo: EquipType[];
    character: CharacterSession;
}

// Las ranuras ubican el centro de cada ítem sobre el fondo de 200 × 300.
// El tamaño del ítem se mantiene en píxeles, independiente del tamaño del fondo.
const EQUIPMENT_POSITIONS = {
    arma: { left: 7, top: 0, width: 36, height: 190 },
    casco: { left: 54, top: 8, width: 37, height: 47 },
    collar: { left: 154, top: 114, width: 38, height: 47 },
    armadura: { left: 58, top: 61, width: 37, height: 98 },
    escudo: { left: 101, top: 61, width: 38, height: 47 },
    pendiente: { left: 151, top: 61, width: 38, height: 47 },
    brazalete: { left: 101, top: 113, width: 38, height: 47 },
    botas: { left: 7, top: 165, width: 36, height: 48 },
} satisfies Record<subTypeEquip, { left: number; top: number; width: number; height: number }>;

export const CharacterEquipmentPanel = ({ equipo, character }: CharacterEquipmentPanelProps) => {
    const { unequipItem, buyEquipmentSlot, selectEquipmentSlot, isPending } = useEquipmentActions(character);
    const { gameConfig } = useCharacterSession();
    const { user } = useUserSession();
    const modal = useModal();
    const [activeMenuSlot, setActiveMenuSlot] = useState<subTypeEquip | null>(null);
    const currencyFormatter = new Intl.NumberFormat('es-AR');

    const handleEquipmentSlotClick = (slot: 1 | 2 | 3) => {
        if (isPending) return;
        if (slot === character.equipo_selected) return;
        if (character.equipo_options[`equipo${slot}_on`]) {
            setActiveMenuSlot(null);
            void selectEquipmentSlot(slot);
            return;
        }

        const slotConfig = gameConfig?.equipment.slots.find((config) => config.slot === slot);
        if (!slotConfig) {
            modal.showNotificationModal({ title: 'No se pudo obtener el precio de esta ranura.' });
            return;
        }

        const currencyName = slotConfig.currency === 'yang' ? 'Yang' : 'MD';
        modal.showActionModal({
            title: `Desbloquear ranura de equipo ${slot}`,
            subTitle: `Precio: ${currencyFormatter.format(slotConfig.cost)} ${currencyName}`,
            acceptText: 'Desbloquear',
            onAccept: async () => {
                const available = slotConfig.currency === 'yang' ? character.yang : user?.md ?? 0;
                if (available < slotConfig.cost) {
                    modal.showNotificationModal({
                        title: `No tienes ${currencyName} suficiente para desbloquear la ranura ${slot}.`,
                    });
                    return;
                }
                await buyEquipmentSlot(slot);
            },
        });
    };

    return (
        <div id="equipo" aria-busy={isPending} className={`flex aspect-[9/14] w-[19%] shrink-0 flex-col bg-[url('/game/marco-equipo.png')] bg-[length:100%_100%] bg-no-repeat px-2 ${isPending ? "cursor-wait" : ""}`}>
            <p className="flex h-[9%] pt-1 shrink-0 items-center b justify-center text-[12px] font-semibold text-[#e9cf99]">Equipo</p>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                <div className="relative h-[200px] w-[154px] shrink-0">
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
                                <InventoryItemTooltip
                                    item={item}
                                    menuOpen={activeMenuSlot === item.sub_type_equip}
                                    suppressTooltip={isPending || activeMenuSlot !== null}
                                    onToggleMenu={() => {
                                        if (isPending) return;
                                        setActiveMenuSlot((current) => current === item.sub_type_equip ? null : item.sub_type_equip);
                                    }}
                                    onCloseMenu={() => setActiveMenuSlot(null)}
                                    onUnequip={() => {
                                        if (isPending) return;
                                        setActiveMenuSlot(null);
                                        void unequipItem(item, character.inventario);
                                    }}
                                >
                                    <div className="relative isolate h-full w-full">
                                        {item.corrupt === true && <ItemCorruptionSmoke />}
                                        <img src={getItemImagePath(item.idItem) ?? item.img} alt={item.name} className="relative z-1 h-full w-full object-contain" />
                                        {item.type === "equip" && item.upgradeLv === 9 && <ItemUpgradeSparkles />}
                                        {item.type === "equip" && item.upgradeLv === 8 && <ItemStaticSparkles />}
                                        {item.type === "equip" && item.upgradeLv === 7 && <ItemStaticSparkles variant="bronze" />}
                                        <EquipSlotIndicators slots={item.slot} filledSlots={item.piedras.length} />
                                    </div>
                                </InventoryItemTooltip>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex h-[20%] shrink-0 flex-col items-center justify-center gap-1 border-t border-[#8e683b]/70 px-1 pb-[0.8rem]">
                <p className="text-center text-[11px] font-semibold text-[#e9cf99]">Ranuras de equipo</p>
                <div className="flex w-full items-center justify-center gap-1">
                    {([1, 2, 3] as const).map((slot) => (
                        <button
                            key={slot}
                            type="button"
                            className="w-[32%] cursor-pointer"
                            aria-label={`Ranura de equipo ${slot}`}
                            aria-pressed={character.equipo_selected === slot}
                            onClick={() => handleEquipmentSlotClick(slot)}
                        >
                            <img
                                src={`/game/bottom_equipo${slot}${character.equipo_selected === slot ? '_on' : ''}.png`}
                                className="w-full"
                                alt=""
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
