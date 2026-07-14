import type { CharacterRace, CharacterSpeciality, ReinosNames } from "netim2-shared";
import type { MainDamageInfo, ReinosInfo, SkillEffectConfig, SkillEffectsType } from "../types/character-creation-card.types";



export const getBackGroundColor = (speciality: CharacterSpeciality | 'base') => {

    const BACKGROUND_COLORES_BY_SPECIALITY: Record<CharacterSpeciality | 'base', string> = {
        base: 'drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]', //blanco
        Espejo: 'drop-shadow-[0_0_18px_rgba(239,68,68,0.9)]', //rojo
        MagiaNegra: 'drop-shadow-[0_0_18px_rgba(168,85,247,0.9)]', //violeta
        Corporal: 'drop-shadow-[0_0_18px_rgba(251,146,60,0.9)]', //naranja
        Daga: 'drop-shadow-[0_0_18px_rgba(34,197,94,0.9)]', //verde
        Dragon: 'drop-shadow-[0_0_18px_rgba(59,130,246,0.9)]', //azul
        Flecha: 'drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]', //celeste
        Mental: 'drop-shadow-[0_0_18px_rgba(120,53,15,0.9)]', //marron
        Luz: 'drop-shadow-[0_0_18px_rgba(250,204,21,0.9)]', //amarillo
    }


    return BACKGROUND_COLORES_BY_SPECIALITY[speciality] ?? BACKGROUND_COLORES_BY_SPECIALITY.base
}


export const getIconRace = (race: CharacterRace, genero: 'masculino' | 'femenino') => {
    const URLS_RACE_ICONS: Record<CharacterRace, Record<'masculino' | 'femenino', string>> = {
        chaman: {
            femenino: '/characterSelection/chaman-f-icon.png',
            masculino: '/characterSelection/chaman-h-icon.png'
        },
        guerrero: {
            femenino: '/characterSelection/guerrero-f-icon.png',
            masculino: '/characterSelection/guerrero-h-icon.png'
        },
        ninja: {
            femenino: '/characterSelection/ninja-f-icon.png',
            masculino: '/characterSelection/ninja-h-icon.png'
        },
        sura: {
            femenino: '/characterSelection/sura-f-icon.png',
            masculino: '/characterSelection/sura-h-icon.png'
        }
    }

    return URLS_RACE_ICONS[race][genero]
}

export const getNameRace = (race: CharacterRace) => {
    const URLS_RACE_NAMES: Record<CharacterRace, string> = {
        chaman: "/characterSelection/chaman-name.png",
        guerrero: "/characterSelection/guerrero-name.png",
        ninja: "/characterSelection/ninja-name.png",
        sura: "/characterSelection/sura-name.png"
    }

    return URLS_RACE_NAMES[race]
}

export const getExplicationByRaceSelected = (race: CharacterRace) => {
    const RACE_EXPLICATION: Record<CharacterRace, string> = {
        chaman: "Los chamanes utilizan auras y magias para potenciar sus ataques.",
        guerrero: "Los guerreros se destacan por su gran resistencia y daño fisico.",
        ninja: "Los ninjas perfeccionaron el arte de la rapidez y causar daños letales.",
        sura: "Los suras son excelentes tanto en magias como ataques fisicos."
    }

    return RACE_EXPLICATION[race]
}

export const getHistoriaByRace = (race: CharacterRace) => {
    const HISTORIA_EXPLICATION: Record<CharacterRace, string> = {
        chaman: 'El estudio intesivo ha proporcionado a los Chamanes la sabiduría necesaria para el uso de la magia y los conjuros en combate. Sus habilidades místicas no solo son tremendamente útiles para ellos, sino también para dañar a sus enemigos, Al especializarse un Chaman puede elegir entre reforzar sus ataques o seguir desarrollando sus hechizos de curacion y apoyo.',
        guerrero: 'Gracias a sus habilidades así como a su armadura pesada, los Guerreros desempeñan un papel esencial en situaciones de combate cuerpo a cuerpo. Entre sus ambiciones destacan principalmente desarollar una gran fuerza fisica y mantener una mente despejada y en paz. Dependiendo de la especialidad elegida, pueden ausar daños muy graves con sus armas a dos manos o bien mediante el hábil manejo de la espada, lo que les permite defenderse de casi cualquier ataque enemigo.',
        ninja: 'Los Ninjas son asesinos profesionales, capaces de pasar inadvertidos y atacar al enemigo por la espalda. Visten armadura protectoras muy ligeras para garantizar la máxima velocidad y agilidad. Así, sus movimientos hábiles no se ven afectados por el paso de una armadura tradicional. Segun su especialización, los Ninjas pueden ser maestros con la daga en situaciones cuerpo a cuerpo, o bien expertos en el tiro con arco en las distancias largas.',
        sura: 'Los Sura son luchadores que obtuvieron poderes mágicos al hacer un pacto con el diablo. La magia que controlan ahora les permite herir a sus enemimgos desde la distancia, mientras que su habilidad de espada les hace excelentes combatientes cuerpo a cuerpo. Al especializarse, los Suras pueden elegir entre mejorar sus hechizos de ataque o desarrollar conjuros fortalecedores.'
    }

    return HISTORIA_EXPLICATION[race]
}

export function getMainDamageType(
    race: CharacterRace,
    speciality: CharacterSpeciality | 'base',
): 'physical' | 'magical' {
    if (race === 'guerrero' || race === 'ninja') {
        return 'physical';
    }

    if (race === 'chaman') {
        return 'magical';
    }

    if (race === 'sura') {
        return speciality === 'MagiaNegra' ? 'magical' : 'physical';
    }

    return 'physical';
}

export function getMainDamageInfo(
    race: CharacterRace,
    speciality: CharacterSpeciality | 'base',
): MainDamageInfo {
    const damageType = getMainDamageType(race, speciality);

    if (damageType === 'magical') {
        return {
            type: 'magical',
            label: 'Daño mágico',
            textClassName: '!text-blue-400',
        };
    }

    return {
        type: 'physical',
        label: 'Daño físico',
        textClassName: '!text-red-400',
    };
}

export const getInfoEffect = (effect: SkillEffectsType) => {
    const EFFECT_DESCRIPTION: Record<SkillEffectsType, string> = {
        curacion: 'Tiene habilidades que le permite curarse.',
        desmayo: 'Tiene habilidades que pueden causar desmayo al enemigo, impidiendo realizar acciones por algunos turnos.',
        incendio: 'TIene habilidades que pueden causar efecto de incendio a su enemigo.',
        penetracion: 'Tiene habilidades que pueden perforar las defensas del enemigo.',
        potenciador: 'Tiene habilidades que tienen chances de multiplicar su daño.',
        retardo: 'Tiene habilidades que pueden provocar el efecto de retardo, reduciendo su velocidad de movimiento, de ataque y de hechizo.',
        sangrado: 'Tiene habilidades que pueden causarle sangrado al enemigo.',
        vampirismo: 'Tiene habilidades que pueden recuperar vida en base a un porcentaje del daño realizado.',
        veneno: 'Tiene habilidades que pueden provocar envenenamiento al enemigo.'

    }

    return EFFECT_DESCRIPTION[effect]
}

export const SPECIALITY_EFFECTS: Partial<Record<CharacterSpeciality, SkillEffectConfig[]>> = {
    Corporal: [
        { effect: 'sangrado', icon: '/characterSelection/bleed-icon.png' },
        { effect: 'desmayo', icon: '/characterSelection/desmayo-icon.png' },
    ],

    Mental: [
        { effect: 'desmayo', icon: '/characterSelection/desmayo-icon.png' },
        { effect: 'retardo', icon: '/characterSelection/retardo-icon.png' },
        { effect: 'penetracion', icon: '/characterSelection/perforation-icon.png' },
    ],

    Daga: [
        { effect: 'veneno', icon: '/characterSelection/posion-icon.png' },
        { effect: 'sangrado', icon: '/characterSelection/bleed-icon.png' },
        { effect: 'potenciador', icon: '/characterSelection/potenciator-icon.png' },
    ],

    Flecha: [
        { effect: 'veneno', icon: '/characterSelection/posion-icon.png' },
        { effect: 'incendio', icon: '/characterSelection/fire-icon.png' },
        { effect: 'desmayo', icon: '/characterSelection/desmayo-icon.png' },
        { effect: 'potenciador', icon: '/characterSelection/potenciator-icon.png' },
    ],

    Dragon: [
        { effect: 'incendio', icon: '/characterSelection/fire-icon.png' },
        { effect: 'potenciador', icon: '/characterSelection/potenciator-icon.png' },
    ],

    Luz: [
        { effect: 'desmayo', icon: '/characterSelection/desmayo-icon.png' },
        { effect: 'curacion', icon: '/characterSelection/life-icon.png' },
    ],

    Espejo: [
        { effect: 'retardo', icon: '/characterSelection/retardo-icon.png' },
        { effect: 'penetracion', icon: '/characterSelection/perforation-icon.png' },
        { effect: 'vampirismo', icon: '/characterSelection/vampirismo-icon.png' },
    ],

    MagiaNegra: [
        { effect: 'incendio', icon: '/characterSelection/fire-icon.png' },
        { effect: 'retardo', icon: '/characterSelection/retardo-icon.png' },
    ],
};

export const Reinos: Record<ReinosNames, ReinosInfo> = {
  chunjo: {
    id: 'chunjo',
    name: 'Chunjo',
    flagClassName: 'bg-[position:0px_0px]',
    colorNameClassName: 'text-yellow-100 font-bold',
    bgClassName: 'bg-yellow-600/40',
    description:
      'El reino de Chunjo está situado al oeste del continente. Es un reino teócrata dirigido por líderes espirituales. Fue fundado por Yoon-Young, primo del anterior Emperador. Su mujer, que tenía poderes mágicos muy fuertes, le ayudó a ver la amenaza causada por las piedras Metin. Aunque advirtió muchas veces que había que hacer algo, fue ignorado. Así que condujo a su gente a una rebelión contra el imperio. Después de que el imperio sucumbiera, su reino entró en guerra con las regiones del este y tuvo problemas con el sur. La gente del Reino de Chunjo quiere reinar sobre todo el continente para poder controlar el creciente poder de las piedras Metin.',
  },

  jinno: {
    id: 'jinno',
    name: 'Jinno',
    flagClassName: 'bg-[position:-104px_0px]',
    colorNameClassName: 'text-blue-100 font-bold',
    bgClassName: 'bg-blue-600/40',
    description:
      'El Reino de Jinno está en las regiones del este del continente. Este reino está basado en su poder militar. Sus gentes son agresivas y guerreras. Jinno es liderado por Ee-Ryoong, el hijo del último Emperador. Él se considera el elegido para restaurar el antiguo imperio bajo su reinado y con sus fuerzas militares. El miedo por el significado y los efectos de las piedras Metin se ignora oficialmente en el Reino de Jinno. En secreto, Ee-Ryoong pretende apoderarse de los poderes destructivos de las piedras Metin para su ejército.',
  },

  shinsoo: {
    id: 'shinsoo',
    name: 'Shinsoo',
    flagClassName: 'bg-[position:-208px_0px]',
    colorNameClassName: 'text-red-100 font-bold',
    bgClassName: 'bg-red-600/40',
    description:
      'El Reino de Shinsoo está al sur del continente. Sus habitantes trabajan principalmente en el comercio. Fundado por Yoon-Yoing después de que el imperio sucumbiese, sus relaciones comerciales se dirigieron rápidamente a la quiebra. Los habitantes luchan constantemente con el oeste y su ruta comercial está totalmente desconectada. Sabiendo que las piedras Metin son una amenaza para su forma de vida, los comerciantes se armaron. Su objetivo es resistir los ataques del oeste, reanudar todas las rutas comerciales y unir todo el continente bajo su mandato.',
  },
};

