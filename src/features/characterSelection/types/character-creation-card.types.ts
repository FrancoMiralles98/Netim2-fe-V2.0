import type { ReinosNames } from "netim2-shared/dist/gamedata/reinos-names.type";
import type { CharacterAttribute, CharacterRace, CharacterSpeciality } from "../../../shared/types/backend/character/character-backend.types";

export type CharacterSpecializationType = 'base' | 'especialidad-1' | 'especialidad-2';

export interface CharacterRaceInfo {
    raza: CharacterRace;
    especialidades: {
        base: CharacterStatsSpeciality;
    } & Partial<Record<CharacterSpeciality, CharacterStatsSpeciality>>;
}

export interface CharacterStatsSpeciality {
    statsLimit: StatsLimit;
}

export type StatsLimit = Record<CharacterAttribute, number>;

export interface MainDamageInfo {
    type: 'physical' | 'magical';
    label: string;
    textClassName: string;
}

export type SkillEffectsType = 'desmayo' | 'retardo' | 'incendio' | 'veneno' | 'sangrado' | 'penetracion' | 'potenciador' | 'curacion' | 'vampirismo'

export interface SkillEffectConfig {
    effect: SkillEffectsType,
    icon: string
}

export interface ReinosInfo {
    id: ReinosNames;
    name: string;
    flagClassName: string;
    colorNameClassName: string;
    bgClassName: string;
    description: string;
}

export interface CharacterCreationValues {
    nombre?: string;
    genero?: 'masculino' | 'femenino';
    reino?: ReinosNames;
    raza?: CharacterRace;
}