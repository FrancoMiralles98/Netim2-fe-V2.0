import { clamp, ease } from "../item-low-level-upgrade/upgrade-visuals";
import { easeOut, highGlow, highStar } from "./high-visuals";

export const getHighSuccessFrame = (progress: number, lift: number) => {
    const time = progress * 2.2;
    return {
        time,
        offset: lift * (1 - ease((time - 0.4) / 1.25)),
        charge: 1 - ease((time - 0.2) / 0.65),
    };
};

/** The approved burst: a main star, three expanding waves, and 58 outward sparks. */
export const drawHighSuccessEnding = (
    context: CanvasRenderingContext2D, progress: number, x: number, y: number, scale: number,
) => {
    const time = progress * 2.2;
    const flash = Math.sin(clamp(time / 0.38) * Math.PI);
    if (time < 0.38) {
        highGlow(context, x, y, 145 * scale, flash * 0.82, "255,198,76");
        highGlow(context, x, y, 49 * scale, flash * 0.95, "255,249,225");
        highStar(context, x, y, 37 * scale, flash, scale);
        context.save();
        context.globalAlpha = flash * 0.8;
        context.strokeStyle = "#ffdc8e";
        context.shadowColor = "#ffd165";
        context.shadowBlur = 12 * scale;
        context.lineWidth = 1.1 * scale;
        context.beginPath();
        context.moveTo(x - 63 * scale, y - 63 * scale); context.lineTo(x + 63 * scale, y + 63 * scale);
        context.moveTo(x + 63 * scale, y - 63 * scale); context.lineTo(x - 63 * scale, y + 63 * scale);
        context.stroke(); context.restore();
    }
    for (let index = 0; index < 3; index++) {
        const age = (time - index * 0.15) / 0.95;
        if (age <= 0 || age >= 1) continue;
        const radius = (14 + easeOut(age) * 143) * scale;
        context.save();
        context.globalAlpha = Math.pow(1 - age, 1.25) * 0.8;
        context.strokeStyle = index === 1 ? "#fff3d1" : "#ffd47d";
        context.lineWidth = (2.1 - age * 1.3) * scale;
        context.shadowColor = "#ffc85c";
        context.shadowBlur = 8 * scale;
        context.beginPath();
        context.ellipse(x, y, radius, radius * (0.68 + index * 0.08), index * 0.23, 0, Math.PI * 2);
        context.stroke(); context.restore();
    }
    for (let index = 0; index < 58; index++) {
        const age = time - index % 5 * 0.012;
        if (age <= 0) continue;
        const progress = clamp(age / 1.65), travel = easeOut(age / 0.7), angle = index * 2.399963;
        const radius = (65 + index * 23 % 99) * travel * scale;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius * 0.75 + progress * progress * 13 * scale;
        const alpha = (1 - ease((age - 0.72) / 1.15)) * (0.76 + 0.24 * Math.sin(age * 24 + index));
        if (alpha <= 0) continue;
        if (age < 0.5) {
            const length = (1 - travel) * 22 * scale;
            context.strokeStyle = `rgba(255,216,125,${alpha * 0.5})`;
            context.lineWidth = scale;
            context.beginPath();
            context.moveTo(px - Math.cos(angle) * length, py - Math.sin(angle) * length * 0.75);
            context.lineTo(px, py); context.stroke();
        }
        highStar(context, px, py, (1.2 + index % 4 * 0.48) * scale, alpha, scale);
        highGlow(context, px, py, 9 * scale, alpha * 0.14, "255,213,119");
    }
};
