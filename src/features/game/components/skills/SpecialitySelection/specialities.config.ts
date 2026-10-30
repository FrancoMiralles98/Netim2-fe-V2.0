import type { CharacterRace, CharacterSpeciality } from "netim2-shared";

interface SpecialityOption {
    name: string;
    icon: CharacterSpeciality;
}

export const SPECIALITIES_BY_RACE = {
    guerrero: [{ name: "Corporal", icon: "Corporal" }, { name: "Mental", icon: "Mental" }],
    ninja: [{ name: "Daga", icon: "Daga" }, { name: "Flecha", icon: "Flecha" }],
    sura: [{ name: "Magia Negra", icon: "MagiaNegra" }, { name: "Espejo", icon: "Espejo" }],
    chaman: [{ name: "Dragón", icon: "Dragon" }, { name: "Luz", icon: "Luz" }],
} as const satisfies Record<CharacterRace, readonly [SpecialityOption, SpecialityOption]>;

export const SPECIALITY_IMAGES = {
    Corporal: "/game/specialitySelection/img-guerrero-corporal.png",
    Mental: "/game/specialitySelection/img-guerrero-mental.png",
    Daga: "/game/specialitySelection/img-ninja-daga.png",
    Flecha: "/game/specialitySelection/img-ninja-flecha.png",
    MagiaNegra: "/game/specialitySelection/img-sura-magia-negra.png",
    Espejo: "/game/specialitySelection/img-sura-espejo.png",
    Dragon: "/game/specialitySelection/img-chaman-dragon.png",
    Luz: "/game/specialitySelection/img-chaman-luz.png",
} as const satisfies Record<CharacterSpeciality, string>;
