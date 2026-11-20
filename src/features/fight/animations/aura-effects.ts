import type { SpritesheetConfig } from "../../../shared/animations/spritesheet/SpritesheetEffect";

export interface AuraEffectConfig extends SpritesheetConfig {
    /** Existing auras use 24 frames; continuous 36-frame auras run at 24 FPS. */
    frameCount: 24 | 36;
    /** Fraction of the image height occupied by the visible aura border. */
    contentHeightRatio?: number;
    /** Card rectangle inside one frame, expressed as fractions of frame size. */
    cardBounds?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    direction?: "normal" | "alternate";
}

const AURA_EFFECTS: Partial<Record<number, AuraEffectConfig>> = {
    42: {
        src: "/spritesheets/dragon-strength-aura-42.webp",
        columns: 6,
        rows: 6,
        frameCount: 36,
        fps: 24,
        cardBounds: {
            left: 50 / 400,
            top: 80 / 220,
            width: 257 / 400,
            height: 60 / 220,
        },
        direction: "normal",
    },
    43: {
        src: "/spritesheets/blessing-arc-aura-43.webp",
        columns: 6,
        rows: 6,
        frameCount: 36,
        fps: 24,
        cardBounds: {
            left: 71.5 / 400,
            top: 90 / 240,
            width: 257 / 400,
            height: 60 / 240,
        },
        direction: "normal",
    },
    44: {
        src: "/spritesheets/golden-aura-44.webp",
        columns: 6,
        rows: 6,
        frameCount: 36,
        fps: 24,
        cardBounds: {
            left: 61 / 377,
            top: 53 / 170,
            width: 257 / 377,
            height: 60 / 170,
        },
        direction: "normal",
    },
};

export const getAuraEffect = (skillId: number): AuraEffectConfig | undefined =>
    AURA_EFFECTS[skillId];
