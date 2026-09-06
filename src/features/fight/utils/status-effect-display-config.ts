import type { ActiveStatusEffectId, DamageType } from "netim2-shared";

export const STATUS_EFFECT_DISPLAY_CONFIG = {
    veneno: {
        name: 'Veneno',
        icon: './characterSelection/posion-icon.png'
    },

    sangrado: {
        name: 'Sangrado',
        icon: './characterSelection/bleed-icon.png'
    },

    incendio: {
        name: 'Incendio',
        icon: '/fight/status-effects/incendio.png'
    },

    electrico: {
        name: 'Eléctrico',
        icon: './characterSelection/posion-icon.png'
    },

    desmayo: {
        name: 'Desmayo',
        icon: '/fight/status-effects/desmayo.png'
    },
    retardo: {
        name: 'Retardo',
        icon: '/fight/status-effects/desmayo.png'
    },
    corta_curacion: {
        name: 'Corta Cura',
        icon: '/fight/status-effects/desmayo.png'
    },
} as const;


export const getCombatVisualIconConfig = {
    veneno: {
        icon: './fight/poison-icon.png'
    },
    sangrado: {
        icon: './fight/icon-bleed-mana.png'
    },

    incendio: {
        icon: '/fight/icon-fire.png'
    },
    electrico: {
        icon: './fight/electric-icon.png'
    },
    ad: {
        icon: './fight/icono-ad.png'
    },
    ap: {
        icon: './fight/icono-ap.png'
    },
    true: {
        icon: './fight/true-icon.png'
    },
    critico: {
        icon: './fight/critico.png'
    },
    heal: {
        icon: './fight/healt-icon1.png'
    }

} as const

export const COMBAT_VISUAL_ICON_CONFIG = {
    veneno: {
        icon: '/fight/poison-icon.png',
    },

    sangrado: {
        icon: '/fight/icon-bleed-mana.png',
    },

    incendio: {
        icon: '/fight/icon-fire.png',
    },

    electrico: {
        icon: '/fight/electric-icon.png',
    },

    ad: {
        icon: '/fight/icono-ad.png',
    },

    ap: {
        icon: '/fight/icono-ap.png',
    },

    true: {
        icon: '/fight/true-icon.png',
    },

    critico: {
        icon: '/fight/critico.png',
    },

    heal: {
        icon: '/fight/healt-icon1.png',
    },

    mana: {
        icon: '/fight/mana-icon.png',
    },
} as const;

export type CombatVisualIconKey =
    keyof typeof COMBAT_VISUAL_ICON_CONFIG;


export const getDamageColor = (
    damageType: DamageType
): string => {

    switch (damageType) {

        case 'ad':
            return 'text-red-400';

        case 'ap':
            return 'text-violet-400';

        case 'true':
            return 'text-white';
    }
};

export const getStatusEffectDamageIcon = (
    effectId: ActiveStatusEffectId
): string => {

    switch (effectId) {

        case 'veneno':
            return COMBAT_VISUAL_ICON_CONFIG
                .veneno.icon;

        case 'sangrado':
            return COMBAT_VISUAL_ICON_CONFIG
                .sangrado.icon;

        case 'incendio':
            return COMBAT_VISUAL_ICON_CONFIG
                .incendio.icon;

        case 'electrico':
            return COMBAT_VISUAL_ICON_CONFIG
                .electrico.icon;

        default:
            return COMBAT_VISUAL_ICON_CONFIG
                .true.icon;
    }
};