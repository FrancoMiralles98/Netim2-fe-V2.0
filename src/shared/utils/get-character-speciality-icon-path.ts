import { UNIQUE_ID_SKILLS } from "netim2-shared";
import type { CharacterSpeciality } from "netim2-shared";
import { getSkillIconPath } from "./get-skill-icon-path";

const SPECIALITY_ICON_SKILL_ID = {
    Corporal: UNIQUE_ID_SKILLS.AURA_DE_ESPADA,
    Mental: UNIQUE_ID_SKILLS.CUERPO_FUERTE,
    Daga: UNIQUE_ID_SKILLS.EMBOSCADA,
    Flecha: UNIQUE_ID_SKILLS.FLECHA_DE_FUEGO,
    Espejo: UNIQUE_ID_SKILLS.HOJA_ENCANTADA,
    MagiaNegra: UNIQUE_ID_SKILLS.ESPIRITU_DE_LA_LLAMA,
    Luz: UNIQUE_ID_SKILLS.LLAMADA_RELAMPAGO,
    Dragon: UNIQUE_ID_SKILLS.RUGIDO_DEL_DRAGON
} satisfies Record<CharacterSpeciality, UNIQUE_ID_SKILLS>;

export const getCharacterSpecialityIconPath = (
    speciality: CharacterSpeciality
): string => getSkillIconPath(
    SPECIALITY_ICON_SKILL_ID[speciality],
    'N'
);
