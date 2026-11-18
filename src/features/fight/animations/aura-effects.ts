import type { SpritesheetConfig } from "../../../shared/animations/spritesheet/SpritesheetEffect";

export interface AuraEffectConfig extends SpritesheetConfig {
    /** All aura spritesheets contain exactly 24 source frames. */
    frameCount: 24;
    /** Fraction of the image height occupied by the visible aura border. */
    contentHeightRatio?: number;
    direction?: "normal" | "alternate";
}

const AURA_EFFECTS: Partial<Record<number, AuraEffectConfig>> = {
    43: {
        src: "/spritesheets/blessing-light-aura-43.webp",
        columns: 6,
        rows: 4,
        frameCount: 24,
        fps: 24,
        contentHeightRatio: 76 / 256,
        direction: "normal",
    },
};

export const getAuraEffect = (skillId: number): AuraEffectConfig | undefined =>
    AURA_EFFECTS[skillId];
