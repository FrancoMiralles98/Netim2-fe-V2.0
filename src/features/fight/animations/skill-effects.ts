import type { SpritesheetConfig } from "../../../shared/animations/spritesheet/SpritesheetEffect";

export type SkillEffectMode = "target" | "projectile";

export interface SkillEffectConfig extends SpritesheetConfig {
    mode: SkillEffectMode;
    width: number;
    height: number;
    anchorX: number;
    anchorY: number;
    /** Fraction of the sequence spent forming at the caster before travelling. */
    launchFraction?: number;
}

const SKILL_EFFECTS: Partial<Record<number, SkillEffectConfig>> = {
    39: {
        src: "/spritesheets/dragon-projectile-39-v2.webp",
        columns: 4,
        rows: 6,
        frameCount: 24,
        fps: 16,
        mode: "projectile",
        width: 280,
        height: 160,
        anchorX: 0.817,
        anchorY: 0.5,
        launchFraction: 4 / 24,
    },
    40: {
        src: "/spritesheets/flying-talisman-40.webp",
        columns: 4,
        rows: 6,
        frameCount: 24,
        fps: 16,
        mode: "projectile",
        width: 240,
        height: 162,
        anchorX: 0.73,
        anchorY: 0.52,
        launchFraction: 4 / 24,
    },
    41: {
        src: "/spritesheets/dragon-fire-41-clean.webp",
        columns: 6,
        rows: 4,
        frameCount: 24,
        fps: 16,
        frameWeights: Array.from({ length: 24 }, (_, index) =>
            index >= 8 && index <= 15 ? 2 : 1),
        mode: "target",
        width: 256,
        height: 256,
        anchorX: 0.5,
        anchorY: 0.86,
    },
};

export const getSkillEffect = (
    skillId: number,
    mode?: SkillEffectMode,
): SkillEffectConfig | undefined => {
    const effect = SKILL_EFFECTS[skillId];
    return effect && mode ? { ...effect, mode } : effect;
};
