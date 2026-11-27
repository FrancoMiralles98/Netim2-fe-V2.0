import { ease, glow, sparkle } from "../item-low-level-upgrade/upgrade-visuals";

/** Growth is capped at full charge; only the tiny vibration continues while waiting. */
export const drawModerateCore = (
    context: CanvasRenderingContext2D, progress: number, time: number,
    x: number, y: number, scale: number,
) => {
    const appearance = ease((progress - 0.12) / 0.2);
    if (appearance <= 0) return;
    const growth = ease((progress - 0.12) / 0.88);
    const vibration = (0.35 + growth * 0.65) * scale;
    const cx = x + Math.sin(time * 71) * vibration;
    const cy = y + Math.cos(time * 83) * vibration * 0.8;
    const radius = (7 + growth * 20) * scale;
    glow(context, cx, cy, radius * 2, appearance * 0.23, "255,226,157");
    context.save();
    context.globalAlpha = appearance * 0.88;
    context.strokeStyle = "#ffebbb";
    context.lineWidth = (1 + growth * 0.4) * scale;
    context.shadowColor = "#ffd273";
    context.shadowBlur = 7 * scale;
    context.beginPath();
    context.arc(cx, cy, Math.max(0.1, radius + Math.sin(time * 67) * 0.55 * scale), 0, Math.PI * 2);
    context.stroke();
    context.restore();
    sparkle(context, cx, cy, (2.1 + growth * 2.7) * scale, appearance, true);
    glow(context, cx, cy, (4 + growth * 6) * scale, appearance * 0.8, "255,249,229");
};
