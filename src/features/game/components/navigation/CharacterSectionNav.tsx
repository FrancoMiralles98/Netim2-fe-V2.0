import type { ReinosNames } from "netim2-shared";

export const CharacterSectionNav = ({ reino }: { reino: ReinosNames | null }) => {
    if (!reino) return null;

    return (
        <nav
            aria-label="Secciones del personaje"
            className="relative aspect-[1300/128] mt-[2rem] ml-[3px] w-full"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[length:100%_100%] bg-no-repeat brightness-83"
                style={{ backgroundImage: `url('/game/navbar-2-${reino}.png')` }}
            />
            <div className="absolute inset-y-[18%] right-[7%] left-[7%] z-10 grid grid-cols-4 items-center text-center font-metin text-[15px] font-semibold text-[#f5e1b5] [text-shadow:0_2px_3px_#000]">
                <span>Perfil</span>
                <span>Habilidades</span>
                <span>Misiones</span>
                <span>Historial</span>
            </div>
        </nav>
    );
};
