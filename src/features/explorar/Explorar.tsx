import { useState } from "react";
import type { GameConfigResponse, ReinosNames } from "netim2-shared";
import { PortalVortex } from "../../shared/animations";
import { useCharacterSession } from "../characterSession/hooks/useCharacterSession";
import { ExploreZoneDetails } from "./ExploreZoneDetails";

const destinations = [
    { id: "city1", name: "Afueras de la ciudad", image: "pyungmoo.png", position: "60% center" },
    { id: "city2", name: "City 2", image: "yagang.png", position: "105% center" },
    { id: "valle", name: "Valle de Seungryong", image: "valle-de-seungryong.png", position: "70% center" },
    { id: "desierto", name: "Desierto Yongbi", image: "desierto-yongbi.png" },
    { id: "montaña", name: "Monte Sohan", image: "monte-sohan.png", position: "70% center" },
    { id: "templo", name: "Templo Oscuro", image: "templo-oscuro.png", position: "80% center" },
] satisfies { id: keyof GameConfigResponse["zonas"]; name: string; image: string; position?: string }[];

const portalArrows = [
    { label: "Zona anterior", image: "/characterSelection/flecha-i.png", left: "23%", direction: -1 },
    { label: "Zona siguiente", image: "/characterSelection/flecha-d.png", left: "51%", direction: 1 },
] as const;

export const Explorar = ({ reino }: { reino: ReinosNames | null }) => {
    const { gameConfig } = useCharacterSession();
    const [destinationIndex, setDestinationIndex] = useState(0);
    const destination = destinations[destinationIndex];
    const zone = gameConfig?.zonas?.[destination.id];
    const portalLandscape = `/utils/missions/backgrounds/${destination.image}`;
    const landscapePosition = destination.position ?? "center";

    return (
        <section
            aria-labelledby="explorar-title"
            className="relative aspect-[4/3] w-full max-w-[1100px] justify-self-center overflow-hidden bg-[length:100%_100%] bg-no-repeat"
            style={{ backgroundImage: reino ? `url('/game/modal-${reino}-rectangular.png')` : undefined }}
        >
            <h2 id="explorar-title" className="sr-only">Explorar</h2>
            <img
                src="/utils/explorar/background-explorar.png"
                alt="Un portal de piedra junto a un guía en la aldea"
                className="absolute top-[8%] left-[4%] h-[84%] w-[92%] object-cover object-center"
                style={{
                    maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent), linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
                    maskComposite: "intersect",
                }}
            />
            <div className="pointer-events-none absolute top-[41.4%] left-[37.2%] w-[52.39%] -translate-x-1/2 -translate-y-1/2">
                <PortalVortex />
                <div
                    className="absolute top-1/2 left-1/2 aspect-square w-[36%] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `url('${portalLandscape}')`,
                        backgroundPosition: landscapePosition,
                        maskImage: "radial-gradient(circle closest-side, black 65%, transparent 100%)",
                    }}
                >
                    <img
                        src={portalLandscape}
                        alt={`${destination.name} visto a través del portal`}
                        className="absolute inset-x-0 top-[8%] h-[84%] w-full object-cover"
                        style={{
                            objectPosition: landscapePosition,
                            maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
                        }}
                    />
                </div>
            </div>
            {portalArrows.map(({ label, image, left, direction }) => (
                <button
                    key={label}
                    type="button"
                    aria-label={label}
                    onClick={() => setDestinationIndex((index) => (index + direction + destinations.length) % destinations.length)}
                    className="absolute top-[68%] grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-md border border-[#b18853] bg-[#20160f]/90 shadow-[0_2px_6px_#000a,inset_0_0_0_1px_#6d4e2c] hover:brightness-125 focus-visible:outline-2 focus-visible:outline-amber-200"
                    style={{ left }}
                >
                    <img src={image} alt="" width={14} height={26} />
                </button>
            ))}
            <aside
                aria-label="Información de la zona"
                className="absolute top-[10.5%] right-[4%] h-[57%] w-[28%] bg-[url('/utils/explorar/modal-explorar.png')] bg-contain bg-center bg-no-repeat text-slate-100"
            >
                <div key={destination.id} className="custom-scrollbar absolute inset-x-[9%] inset-y-[9%] overflow-y-auto">
                    {zone ? (
                        <ExploreZoneDetails name={destination.name} zone={zone} />
                    ) : (
                        <p className="text-center text-sm">No hay información disponible para {destination.name}.</p>
                    )}
                </div>
            </aside>
        </section>
    );
};
