import type {
    ActiveStatusEffectId,
    ActionStatistics,
    DamageDelivery,
    DamageType,
    HitStatistics
} from "netim2-shared";
import {
    COMBAT_VISUAL_ICON_CONFIG,
    STATUS_EFFECT_DISPLAY_CONFIG
} from "../../fight/utils/status-effect-display-config";

export interface FightStatisticVisualConfig {
    label: string;
    colorClass: string;
    textColorClass: string;
    icon?: string;
}

export const DAMAGE_TYPE_STATISTIC_CONFIG = {
    ad: {
        label: 'Físico',
        colorClass: COMBAT_VISUAL_ICON_CONFIG.ad.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.ad.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.ad.icon
    },
    ap: {
        label: 'Mágico',
        colorClass: COMBAT_VISUAL_ICON_CONFIG.ap.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.ap.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.ap.icon
    },
    true: {
        label: 'Verdadero',
        colorClass: COMBAT_VISUAL_ICON_CONFIG.true.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.true.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.true.icon
    }
} satisfies Record<DamageType, FightStatisticVisualConfig>;

export const DAMAGE_DELIVERY_STATISTIC_CONFIG = {
    direct: {
        label: 'Directo',
        colorClass: 'bg-amber-500',
        textColorClass: 'text-amber-300'
    },
    periodic: {
        label: 'Periódico',
        colorClass: 'bg-lime-500',
        textColorClass: 'text-lime-300'
    },
    reflected: {
        label: 'Reflejado',
        colorClass: 'bg-violet-500',
        textColorClass: 'text-violet-300'
    }
} satisfies Record<DamageDelivery, FightStatisticVisualConfig>;

export const DAMAGE_SOURCE_STATISTIC_CONFIG = {
    basicAttack: {
        label: 'Ataques básicos',
        colorClass: 'bg-orange-500',
        textColorClass: 'text-orange-300'
    },
    skills: {
        label: 'Habilidades',
        colorClass: 'bg-blue-500',
        textColorClass: 'text-blue-300'
    },
    statusEffects: {
        label: 'Estados',
        colorClass: 'bg-green-500',
        textColorClass: 'text-green-300'
    },
    reflected: {
        label: 'Reflejado',
        colorClass: 'bg-violet-500',
        textColorClass: 'text-violet-300'
    }
} as const satisfies Record<string, FightStatisticVisualConfig>;

export const STATUS_EFFECT_STATISTIC_CONFIG = {
    veneno: {
        label: STATUS_EFFECT_DISPLAY_CONFIG.veneno.name,
        colorClass: COMBAT_VISUAL_ICON_CONFIG.veneno.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.veneno.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.veneno.icon
    },
    sangrado: {
        label: STATUS_EFFECT_DISPLAY_CONFIG.sangrado.name,
        colorClass: COMBAT_VISUAL_ICON_CONFIG.sangrado.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.sangrado.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.sangrado.icon
    },
    incendio: {
        label: STATUS_EFFECT_DISPLAY_CONFIG.incendio.name,
        colorClass: COMBAT_VISUAL_ICON_CONFIG.incendio.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.incendio.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.incendio.icon
    },
    electrico: {
        label: STATUS_EFFECT_DISPLAY_CONFIG.electrico.name,
        colorClass: COMBAT_VISUAL_ICON_CONFIG.electrico.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.electrico.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.electrico.icon
    },
    desmayo: {
        label: STATUS_EFFECT_DISPLAY_CONFIG.desmayo.name,
        colorClass: 'bg-violet-500',
        textColorClass: 'text-violet-300',
        icon: STATUS_EFFECT_DISPLAY_CONFIG.desmayo.icon
    },
    retardo: {
        label: STATUS_EFFECT_DISPLAY_CONFIG.retardo.name,
        colorClass: 'bg-slate-500',
        textColorClass: 'text-slate-300',
        icon: STATUS_EFFECT_DISPLAY_CONFIG.retardo.icon
    },
    corta_curacion: {
        label: STATUS_EFFECT_DISPLAY_CONFIG.corta_curacion.name,
        colorClass: 'bg-pink-500',
        textColorClass: 'text-pink-300',
        icon: STATUS_EFFECT_DISPLAY_CONFIG.corta_curacion.icon
    }
} satisfies Record<ActiveStatusEffectId, FightStatisticVisualConfig>;

export const SKILL_STATISTIC_COLOR_CLASSES = [
    'bg-blue-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-fuchsia-500'
] as const;

export const UNCLASSIFIED_STATISTIC_CONFIG = {
    label: 'Sin clasificar',
    colorClass: 'bg-slate-600',
    textColorClass: 'text-slate-400'
} satisfies FightStatisticVisualConfig;

export type HitStatisticVisualKey = Exclude<
    keyof HitStatistics,
    'attempted'
>;

export const HIT_STATISTIC_CONFIG = {
    successful: {
        label: 'Exitosos',
        colorClass: 'bg-green-500',
        textColorClass: 'text-green-300'
    },
    missed: {
        label: 'Fallados',
        colorClass: 'bg-slate-500',
        textColorClass: 'text-slate-300'
    },
    dodged: {
        label: 'Esquivados',
        colorClass: 'bg-cyan-500',
        textColorClass: 'text-cyan-300'
    },
    blocked: {
        label: 'Bloqueados',
        colorClass: 'bg-amber-500',
        textColorClass: 'text-amber-300'
    },
    reflected: {
        label: 'Reflejados',
        colorClass: 'bg-violet-500',
        textColorClass: 'text-violet-300'
    },
    critical: {
        label: 'Críticos',
        colorClass: COMBAT_VISUAL_ICON_CONFIG.critico.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.critico.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.critico.icon
    },
    penetrating: {
        label: 'Penetrantes',
        colorClass: 'bg-orange-500',
        textColorClass: 'text-orange-300',
        icon: '/characterSelection/perforation-icon.png'
    },
    doubleHitsTriggered: {
        label: 'Golpes dobles activados',
        colorClass: 'bg-fuchsia-500',
        textColorClass: 'text-fuchsia-300',
        icon: '/fight/basic-attack.png'
    }
} satisfies Record<
    HitStatisticVisualKey,
    FightStatisticVisualConfig
>;

export type HealingSourceVisualKey =
    | 'byBasicAttack'
    | 'bySkill'
    | 'hpRegenerated';

export const HEALING_SOURCE_STATISTIC_CONFIG = {
    byBasicAttack: {
        label: 'Robo de vida',
        colorClass: 'bg-red-500',
        textColorClass: 'text-red-300',
        icon: '/characterSelection/vampirismo-icon.png'
    },
    bySkill: {
        label: 'Habilidades',
        colorClass: COMBAT_VISUAL_ICON_CONFIG.heal.backgroundColor,
        textColorClass: COMBAT_VISUAL_ICON_CONFIG.heal.color,
        icon: COMBAT_VISUAL_ICON_CONFIG.heal.icon
    },
    hpRegenerated: {
        label: 'Regeneración de vida',
        colorClass: 'bg-lime-500',
        textColorClass: 'text-lime-300',
        icon: '/characterSelection/life-icon.png'
    }
} satisfies Record<
    HealingSourceVisualKey,
    FightStatisticVisualConfig
>;

export const HEALING_PREVENTED_STATISTIC_CONFIG = {
    label: 'Curación impedida',
    colorClass: 'bg-pink-500',
    textColorClass: 'text-pink-300',
    icon: STATUS_EFFECT_DISPLAY_CONFIG.corta_curacion.icon
} satisfies FightStatisticVisualConfig;

export const ACTION_STATISTIC_CONFIG = {
    turnsPlayed: {
        label: 'Turnos jugados',
        colorClass: 'bg-sky-500',
        textColorClass: 'text-sky-300'
    },
    basicAttacksUsed: {
        label: 'Ataques básicos',
        colorClass: 'bg-orange-500',
        textColorClass: 'text-orange-300',
        icon: '/fight/basic-attack.png'
    },
    skillsUsed: {
        label: 'Habilidades',
        colorClass: 'bg-blue-500',
        textColorClass: 'text-blue-300'
    },
    skippedTurns: {
        label: 'Turnos omitidos',
        colorClass: 'bg-slate-500',
        textColorClass: 'text-slate-300'
    },
    skippedByStun: {
        label: 'Por desmayo',
        colorClass: 'bg-violet-500',
        textColorClass: 'text-violet-300',
        icon: STATUS_EFFECT_DISPLAY_CONFIG.desmayo.icon
    }
} satisfies Record<keyof ActionStatistics, FightStatisticVisualConfig>;

export const OTHER_SKIPPED_ACTION_CONFIG = {
    label: 'Otros motivos',
    colorClass: 'bg-slate-500',
    textColorClass: 'text-slate-300'
} satisfies FightStatisticVisualConfig;
