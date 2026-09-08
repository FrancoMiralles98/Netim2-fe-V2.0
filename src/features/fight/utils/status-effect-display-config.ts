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


export const COMBAT_VISUAL_ICON_CONFIG = {
    veneno: {
        icon: '/fight/poison-icon.png',
        color: 'text-orange-300'
    },

    sangrado: {
        icon: '/fight/icon-bleed-mana.png',
        color: 'text-orange-300'
    },

    incendio: {
        icon: '/fight/icon-fire.png',
        color: 'text-orange-300'
    },

    electrico: {
        icon: '/fight/electric-icon.png',
        color: 'text-orange-300'
    },

    ad: {
        icon: '/fight/icono-ad.png',
        color: 'text-orange-300'
    },

    ap: {
        icon: '/fight/icono-ap.png',
        color: 'text-orange-300'
    },

    true: {
        icon: '/fight/true-icon.png',
        color: 'text-orange-300'
    },

    critico: {
        icon: '/fight/critico.png',
        color: 'text-orange-300'
    },

    heal: {
        icon: '/fight/healt-icon1.png',
        color: 'text-orange-300'
    },

    mana: {
        icon: '/fight/mana-icon.png',
        color: 'text-orange-300'
    },
} as const;

export type CombatVisualIconKey =
    keyof typeof COMBAT_VISUAL_ICON_CONFIG;


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