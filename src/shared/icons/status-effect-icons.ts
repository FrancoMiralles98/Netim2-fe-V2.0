import type { ActiveStatusEffectId } from "netim2-shared";

interface StatusEffectIconPaths {
    fight: string;
    general: string;
}

export const STATUS_EFFECT_ICONS = {
    veneno: { fight: "/fight/poison-icon.png", general: "/icons/statusEffect/posion-icon.png" },
    sangrado: { fight: "/fight/icon-bleed-mana.png", general: "/icons/statusEffect/bleed-icon.png" },
    incendio: { fight: "/fight/icon-fire.png", general: "/icons/statusEffect/fire-icon.png" },
    electrico: { fight: "/fight/electric-icon.png", general: "/icons/statusEffect/electrico.png" },
    desmayo: { fight: "/icons/statusEffect/desmayo-icon.png", general: "/icons/statusEffect/desmayo-icon.png" },
    retardo: { fight: "/icons/statusEffect/retardo-icon.png", general: "/icons/statusEffect/retardo-icon.png" },
    corta_curacion: { fight: "/icons/statusEffect/cdr-icon.png", general: "/icons/statusEffect/cdr-icon.png" },
} as const satisfies Record<ActiveStatusEffectId, StatusEffectIconPaths>;

/** Devuelve las rutas de combate y de uso general a partir del ID o de un estado activo. */
export const getStatusEffectIcons = (effect: ActiveStatusEffectId | { effectId: ActiveStatusEffectId }): StatusEffectIconPaths => (
    STATUS_EFFECT_ICONS[typeof effect === "string" ? effect : effect.effectId]
);

// Efectos de habilidades que no forman parte de ActiveStatusEffectId.
export const SKILL_EFFECT_ICONS = {
    penetracion: "/icons/statusEffect/perforation-icon.png",
    potenciador: "/icons/statusEffect/potenciator-icon.png",
    curacion: "/icons/statusEffect/life-icon.png",
    vampirismo: "/icons/statusEffect/vampirismo-icon.png",
    cdr: STATUS_EFFECT_ICONS.corta_curacion.general,
} as const;
