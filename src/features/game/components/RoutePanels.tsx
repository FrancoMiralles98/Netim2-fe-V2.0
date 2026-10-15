import type { ReinosNames } from "netim2-shared";
import { ButtonReino } from "../../../shared/button/ButtonReino";

interface RoutePanelsProps {
    reino: ReinosNames | null;
}

export const RoutePanels = ({ reino }: RoutePanelsProps) => (
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
                        <ButtonReino reino={reino} texto="Tienda General" />
                        <ButtonReino reino={reino} texto="Tienda De Armas" />
                        <ButtonReino reino={reino} texto="Tienda De Armaduras" />
                        <ButtonReino reino={reino} texto="Arena" />
                        <ButtonReino reino={reino} texto="Herrero" />
                        <ButtonReino reino={reino} texto="Capitán" />
                        <ButtonReino reino={reino} texto="Establo" />
                        <ButtonReino reino={reino} texto="Encantador" />
                        <ButtonReino reino={reino} texto="Orfebre" />
                        <ButtonReino reino={reino} texto="Mercado" />
                        <ButtonReino reino={reino} texto="La Costa" />
                    </div>
                </div>
            </>
        )}
    </section>
);
