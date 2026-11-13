import type { ActiveStatusEffectId } from "netim2-shared";
import { COMBAT_COLORS } from "../../../shared/colors/combat-colors";
import { getStatusEffectIcons } from "../../../shared/icons/status-effect-icons";

export const STATUS_EFFECT_DISPLAY_CONFIG = {
    veneno: {
        name: 'Veneno',
        icon: getStatusEffectIcons('veneno').general
    },

    sangrado: {
        name: 'Sangrado',
        icon: getStatusEffectIcons('sangrado').general
    },

    incendio: {
        name: 'Incendio',
        icon: getStatusEffectIcons('incendio').general
    },

    electrico: {
        name: 'Eléctrico',
        icon: getStatusEffectIcons('electrico').general
    },
    desmayo: {
        name: 'Desmayo',
        icon: getStatusEffectIcons('desmayo').general
    },
    retardo: {
        name: 'Retardo',
        icon: getStatusEffectIcons('retardo').general
    },
    corta_curacion: {
        name: 'Corta Cura',
        icon: getStatusEffectIcons('corta_curacion').general
    },
} as const;


export const COMBAT_VISUAL_ICON_CONFIG = {
    veneno: {
        icon: getStatusEffectIcons('veneno').fight,
        color: COMBAT_COLORS.veneno.text,
        backgroundColor: COMBAT_COLORS.veneno.bg
    },

    sangrado: {
        icon: getStatusEffectIcons('sangrado').fight,
        color: COMBAT_COLORS.sangrado.text,
        backgroundColor: COMBAT_COLORS.sangrado.bg
    },

    incendio: {
        icon: getStatusEffectIcons('incendio').fight,
        color: COMBAT_COLORS.incendio.text,
        backgroundColor: COMBAT_COLORS.incendio.bg
    },

    electrico: {
        icon: getStatusEffectIcons('electrico').fight,
        color: COMBAT_COLORS.electrico.text,
        backgroundColor: COMBAT_COLORS.electrico.bg
    },

    ad: {
        icon: '/fight/icono-ad.png',
        color: COMBAT_COLORS.ad.text,
        backgroundColor: COMBAT_COLORS.ad.bg
    },

    ap: {
        icon: '/fight/icono-ap.png',
        color: COMBAT_COLORS.ap.text,
        backgroundColor: COMBAT_COLORS.ap.bg
    },

    true: {
        icon: '/fight/true-icon.png',
        color: COMBAT_COLORS.true.text,
        backgroundColor: COMBAT_COLORS.true.bg
    },

    critico: {
        icon: '/fight/critico.png',
        color: 'text-yellow-300',
        backgroundColor: 'bg-yellow-400'
    },

    penetracion: {
        icon: '/fight/penetracion.png',
        color: 'text-orange-300',
        backgroundColor: 'bg-orange-500'
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
