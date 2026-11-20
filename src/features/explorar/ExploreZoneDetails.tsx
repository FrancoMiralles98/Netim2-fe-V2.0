import type { ZoneConfig } from "netim2-shared";
import { getItemImagePath } from "../inventory/getItemImagePath";

interface ExploreZoneDetailsProps {
    name: string;
    zone: Omit<ZoneConfig, "mobsLevls"> & { mobsLevls: ZoneConfig["mobsLevls"] | [] };
}

export const ExploreZoneDetails = ({ name, zone }: ExploreZoneDetailsProps) => {
    const [minMobLevel, maxMobLevel] = zone.mobsLevls;
    const mobLevels = minMobLevel === undefined
        ? "Sin datos"
        : minMobLevel === maxMobLevel ? minMobLevel : `${minMobLevel}–${maxMobLevel}`;

    return (
        <div className="space-y-3 text-sm">
            <h3 className="text-center font-metin text-lg font-semibold text-[#f5e1b5]">{name}</h3>
            <dl className="space-y-2 border-t border-amber-200/25 pt-3">
                <div className="flex flex-wrap justify-between gap-x-2">
                    <dt>Nivel de enemigos</dt>
                    <dd className="text-amber-100">{mobLevels}</dd>
                </div>
                {zone.lvToUnlock !== undefined && (
                    <div className="flex flex-wrap justify-between gap-x-2">
                        <dt>Nivel requerido</dt>
                        <dd className="text-amber-100">{zone.lvToUnlock}</dd>
                    </div>
                )}
                {zone.cost !== undefined && (
                    <div className="flex flex-wrap justify-between gap-x-2">
                        <dt>Costo del viaje</dt>
                        <dd className="flex items-center gap-1 text-amber-100">
                            {zone.cost === 0 ? "Gratis" : (
                                <>
                                    {zone.cost.toLocaleString("es-AR")}
                                    <img src="/utils/yang-icon.png" alt="Yang" className="size-4 object-contain" />
                                </>
                            )}
                        </dd>
                    </div>
                )}
            </dl>
            <div className="border-t border-amber-200/25 pt-3">
                <h4 className="mb-2 font-semibold text-amber-100">Ítems de la zona</h4>
                {zone.idItems.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5">
                        {zone.idItems.map((idItem) => {
                            const imagePath = getItemImagePath(idItem);
                            return (
                                <li key={idItem} title={`Ítem #${idItem}`} className="grid size-8 place-items-center rounded border border-amber-200/25 bg-black/40">
                                    {imagePath ? <img src={imagePath} alt={`Ítem #${idItem}`} className="size-full object-contain" /> : <span>{idItem}</span>}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-xs text-slate-300">Sin ítems listados.</p>
                )}
            </div>
        </div>
    );
};
