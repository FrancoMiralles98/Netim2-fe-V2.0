import type { NpcShopId, ReinosNames } from "netim2-shared";
import { ButtonReino } from "../../../../shared/button/ButtonReino";
import { tiendas } from "../../../tiendas/tiendas.config";

interface RoutePanelsProps {
    reino: ReinosNames | null;
    isExploreActive: boolean;
    onExplore: () => void;
    activeStore: NpcShopId | null;
    onStore: (tipo: NpcShopId) => void;
    isBlacksmithActive: boolean;
    onBlacksmith: () => void;
}

export const RoutePanels = ({ reino, isExploreActive, onExplore, activeStore, onStore, isBlacksmithActive, onBlacksmith }: RoutePanelsProps) => (
    <section id='paneles de rutas'>
        {reino && (
            <>
                <div className="relative mt-[2rem]" id='fondo-chico'>
                    <img
                        className="block w-full h-[165px]"
                        src={`/game/fondo-2-${reino}.png`}
                        alt=""
                    />
                    <div className="absolute inset-0 z-10 flex flex-col items-start justify-start gap-1 px-4 pt-4">
                        <ButtonReino reino={reino} texto="Clasificación" />
                        <ButtonReino reino={reino} texto="Gremio" />
                        <ButtonReino reino={reino} texto="Item Shop" />
                        <ButtonReino reino={reino} texto="Wiki" />
                    </div>
                </div>
                <div className="relative mt-[2rem]" id='fondo-grande'>
                    <img
                        className="block h-[30rem] w-full"
                        src={`/game/fondo-${reino}.png`}
                        alt=""
                    />
                    <div className="absolute mt-[5rem] mb-[1rem] inset-0 z-10 flex flex-col items-start justify-start gap-[5px] px-4">
                        <ButtonReino reino={reino} texto="Explorar" onClick={onExplore} pressed={isExploreActive} />
                        {(["general", "weapons", "armors"] as const).map(tipo => (
                            <ButtonReino key={tipo} reino={reino} texto={tiendas[tipo].nombre} onClick={() => onStore(tipo)} pressed={activeStore === tipo} />
                        ))}
                        <ButtonReino reino={reino} texto="Arena" />
                        <ButtonReino reino={reino} texto="Herrero" onClick={onBlacksmith} pressed={isBlacksmithActive} />
                        <ButtonReino reino={reino} texto="Capitán" />
                        <ButtonReino reino={reino} texto="Establo" onClick={() => onStore("stable")} pressed={activeStore === "stable"} />
                        <ButtonReino reino={reino} texto="Encantador" />
                        <ButtonReino reino={reino} texto="Orfebre" />
                        <ButtonReino reino={reino} texto="Mercado" />
                        <ButtonReino reino={reino} texto="La Costa" onClick={() => onStore("fishing")} pressed={activeStore === "fishing"} />
                    </div>
                </div>
            </>
        )}
    </section>
);
