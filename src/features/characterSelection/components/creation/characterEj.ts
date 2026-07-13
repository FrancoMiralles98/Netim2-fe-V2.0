import type { CharacterRaceInfo } from "../../types/character-creation-card.types";

export const characterEjSura: CharacterRaceInfo = {
    raza: 'sura',
    especialidades: {
        base: {
            statsLimit: {
                DEX: 40,
                INT: 49,
                STR: 49,
                VIT: 62
            }
        },
        MagiaNegra: {
            statsLimit: {
                DEX: 60,
                INT: 112,
                STR: 79,
                VIT: 99
            }
        },
        Espejo: {
            statsLimit: {
                DEX: 60,
                INT: 79,
                STR: 99,
                VIT: 112
            }
        }
    },
}

export const characterEjGuerrero: CharacterRaceInfo = {
    raza: 'guerrero',
    especialidades: {
        base: {
            statsLimit: {
                DEX: 40,
                INT: 27,
                STR: 67,
                VIT: 67
            }
        },
        Corporal: {
            statsLimit: {
                DEX: 85,
                INT: 47,
                STR: 117,
                VIT: 102
            }
        },
        Mental: {
            statsLimit: {
                DEX: 50,
                INT: 72,
                STR: 102,
                VIT: 122
            }
        }
    },
}

export const characterEjNinja: CharacterRaceInfo = {
    raza: 'ninja',
    especialidades: {
        base: {
            statsLimit: {
                DEX: 65,
                INT: 37,
                STR: 40,
                VIT: 58
            }
        },
        Daga: {
            statsLimit: {
                DEX: 115,
                INT: 73,
                STR: 65,
                VIT: 97
            }
        },
        Flecha: {
            statsLimit: {
                DEX: 120,
                INT: 57,
                STR: 85,
                VIT: 88
            }
        }
    },
}

export const characterEjChaman: CharacterRaceInfo = {
    raza: 'chaman',
    especialidades: {
        base: {
            statsLimit: {
                DEX: 47,
                INT: 73,
                STR: 30,
                VIT: 50
            }
        },
        Dragon: {
            statsLimit: {
                DEX: 60,
                INT: 108,
                STR: 85,
                VIT: 97
            }
        },
        Luz: {
            statsLimit: {
                DEX: 87,
                INT: 128,
                STR: 52,
                VIT: 83
            }
        }
    },
}

