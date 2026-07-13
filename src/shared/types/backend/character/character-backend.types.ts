import type { BonusRefKeys } from "../bonus/bonus-backend.types"

export type CharacterRace =
    'chaman' |
    'ninja' |
    'guerrero' |
    'sura'

export type CharacterAttribute = Extract<BonusRefKeys, 'VIT' | 'INT' | 'STR' | 'DEX'>

export type CharacterSpeciality =
    'MagiaNegra' |
    'Espejo' |
    'Corporal' |
    'Mental' |
    'Daga' |
    'Flecha' |
    'Luz' |
    'Dragon'
