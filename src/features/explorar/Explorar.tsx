import type { ReinosNames } from "netim2-shared";
import { PortalVortex } from "../../shared/animations";

const portalLandscape = "/utils/missions/backgrounds/pyungmoo.png";
const portalArrows = [
    { label: "Anterior", image: "/characterSelection/flecha-i.png", left: "23%" },
    { label: "Siguiente", image: "/characterSelection/flecha-d.png", left: "51%" },
] as const;

export const Explorar = ({ reino }: { reino: ReinosNames | null }) => (
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
                    backgroundPosition: "72% center",
                    maskImage: "radial-gradient(circle closest-side, black 65%, transparent 100%)",
                }}
            >
                <img
                    src={portalLandscape}
                    alt="Pyungmoo visto a través del portal"
                    className="absolute inset-x-0 top-[8%] h-[84%] w-full object-cover object-[72%_center]"
                    style={{ maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)" }}
                />
            </div>
        </div>
        {portalArrows.map(({ label, image, left }) => (
            <button
                key={label}
                type="button"
                aria-label={label}
                disabled
                className="absolute top-[68%] grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border border-[#b18853] bg-[#20160f]/90 shadow-[0_2px_6px_#000a,inset_0_0_0_1px_#6d4e2c]"
                style={{ left }}
            >
                <img src={image} alt="" width={14} height={26} />
            </button>
        ))}
        <img
            src="/utils/explorar/modal-explorar.png"
            alt=""
            className="pointer-events-none absolute top-[10.5%] right-[4%] h-[57%] w-[28%] object-contain object-right"
        />
    </section>
);
