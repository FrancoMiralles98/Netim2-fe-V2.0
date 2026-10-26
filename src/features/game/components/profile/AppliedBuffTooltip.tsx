import { useEffect, useId, useRef, useState } from "react";
import type { AppliedBuffos } from "netim2-shared";
import { CorruptImplicitBonuses, ImplicitBonuses } from "../../../inventory/components/EquipBonusGroups";
import { InventoryTooltipPortal } from "../../../inventory/components/InventoryTooltipPortal";
import { getBuffIconPath } from "./getBuffIconPath";

export const AppliedBuffTooltip = ({ buff }: { buff: AppliedBuffos }) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [now, setNow] = useState(() => Date.now());
    const iconPath = getBuffIconPath(buff.id_buff);
    const hasBonuses = buff.implicitBonus.length > 0 || buff.corruptBonus.length > 0;
    const remainingSeconds = Math.max(0, Math.ceil(
        (buff.buff_inicialization + buff.buff_duration * 1000 - now) / 1000,
    ));
    const remainingTime = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;

    useEffect(() => {
        if (!isOpen) return;
        const interval = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(interval);
    }, [isOpen]);

    const openTooltip = () => {
        setNow(Date.now());
        setIsOpen(true);
    };

    return (
        <>
            <div
                ref={triggerRef}
                role="img"
                tabIndex={0}
                aria-label={`Buffo activo: ${buff.buff_name}`}
                aria-describedby={isOpen ? tooltipId : undefined}
                className="flex h-[32px] w-[32px] shrink-0 cursor-help items-center justify-center rounded border border-[#a97735]/75 bg-black/50 text-[14px] font-semibold focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e9cf99]"
                onMouseEnter={openTooltip}
                onMouseLeave={() => setIsOpen(false)}
                onFocus={openTooltip}
                onBlur={() => setIsOpen(false)}
            >
                {iconPath ? (
                    <img src={iconPath} alt="" aria-hidden="true" className="h-full w-full object-contain" />
                ) : (
                    <span aria-hidden="true">{buff.buff_name.charAt(0).toUpperCase()}</span>
                )}
            </div>
            {isOpen && (
                <InventoryTooltipPortal anchorRef={triggerRef} id={tooltipId}>
                    <section className="w-[200px] max-w-[calc(100vw-48px)] p-1 text-center">
                        <h3 className="text-[14px] font-medium text-white">{buff.buff_name}</h3>
                        <p className="mt-1 text-[11px] text-gray-200">
                            Tipo de Buff: <span className="text-emerald-200">{buff.id_buff}</span>
                        </p>
                        {hasBonuses ? (
                            <div className="mt-2 space-y-2 whitespace-normal break-words text-[12px] leading-[16px]">
                                <ImplicitBonuses bonuses={buff.implicitBonus} />
                                <CorruptImplicitBonuses bonuses={buff.corruptBonus} />
                            </div>
                        ) : buff.buff_description ? (
                            <p className="mt-2 whitespace-normal break-words text-[12px] leading-[16px] text-gray-200">
                                {buff.buff_description}
                            </p>
                        ) : null}
                        <div className="mt-3 space-y-1 text-[12px] text-gray-200">
                            <p>[ Duración restante ]</p>
                            <p>{remainingTime}</p>
                        </div>
                    </section>
                </InventoryTooltipPortal>
            )}
        </>
    );
};
