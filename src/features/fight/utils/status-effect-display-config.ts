import type { ActiveStatusEffectId } from "netim2-shared";

export const STATUS_EFFECT_DISPLAY_CONFIG = {
    veneno: {
        name: 'Veneno',
        icon: '/characterSelection/posion-icon.png'
    },

    sangrado: {
        name: 'Sangrado',
        icon: '/characterSelection/bleed-icon.png'
    },

    incendio: {
        name: 'Incendio',
        icon: '/characterSelection/fire-icon.png'
    },

    electrico: {
        name: 'Eléctrico',
        icon: '/fight/electric-icon.png'
    },
    desmayo: {
        name: 'Desmayo',
        icon: '/characterSelection/desmayo-icon.png'
    },
    retardo: {
        name: 'Retardo',
        icon: '/characterSelection/retardo-icon.png'
    },
    corta_curacion: {
        name: 'Corta Cura',
        icon: '/characterSelection/cdr-icon.png'
    },
} as const;


export const COMBAT_VISUAL_ICON_CONFIG = {
    veneno: {
        icon: '/fight/poison-icon.png',
        color: 'text-green-500',
        backgroundColor: 'bg-green-500'
    },

    sangrado: {
        icon: '/fight/icon-bleed-mana.png',
        color: 'text-red-500',
        backgroundColor: 'bg-red-500'
    },

    incendio: {
        icon: '/fight/icon-fire.png',
        color: 'text-orange-500',
        backgroundColor: 'bg-orange-500'
    },

    electrico: {
        icon: '/fight/electric-icon.png',
        color: 'text-cyan-400',
        backgroundColor: 'bg-cyan-400'
    },

    ad: {
        icon: '/fight/icono-ad.png',
        color: 'text-orange-300',
        backgroundColor: 'bg-orange-500'
    },

    ap: {
        icon: '/fight/icono-ap.png',
        color: 'text-blue-300',
        backgroundColor: 'bg-blue-500'
    },

    true: {
        icon: '/fight/true-icon.png',
        color: 'text-slate-100',
        backgroundColor: 'bg-slate-100'
    },

    critico: {
        icon: '/fight/critico.png',
        color: 'text-yellow-300',
        backgroundColor: 'bg-yellow-400'
    },

    heal: {
        icon: '/fight/healt-icon1.png',
        color: 'text-green-400',
        backgroundColor: 'bg-green-500'
    },

    mana: {
        icon: '/fight/mana-icon1.png',
        color: 'text-blue-400',
        backgroundColor: 'bg-blue-500'
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
