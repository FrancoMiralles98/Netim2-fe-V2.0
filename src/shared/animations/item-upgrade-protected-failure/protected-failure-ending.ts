import { clamp, ease } from "../item-low-level-upgrade/upgrade-visuals";
import type { ProtectedFailureSpark } from "./protected-failure-particles";

const ENDING_SECONDS = 4.3;
const remainingLift = (time: number) => 1 - ease((time - 1.6) / 1.5);

export const getProtectedFailureFrame = (progress: number, lift: number) => {
    const time = progress * ENDING_SECONDS;
    return {
        time,
        offset: lift * remainingLift(time),
        heat: ease((time - 0.3) / 0.8),
        charge: 1 - ease((time - 1.8) / 1.65),
    };
};

export const renderProtectedFailureTint = (
    silhouette: HTMLElement, frame: ReturnType<typeof getProtectedFailureFrame>,
) => {
    const green = Math.round(247 + (138 - 247) * frame.heat);
    const blue = Math.round(232 + (53 - 232) * frame.heat);
    silhouette.style.backgroundColor = `rgb(255, ${green}, ${blue})`;
    silhouette.style.opacity = String(frame.charge);
    silhouette.style.filter = `drop-shadow(0 0 ${8 + frame.heat}px rgba(255,${green},${blue},.9))`;
};

const glow = (context: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number, color = "255,137,53") => {
    if (radius <= 0 || alpha <= 0) return;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${color},${alpha})`);
    gradient.addColorStop(0.28, `rgba(${color},${alpha * 0.36})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
};

const sparkle = (
    context: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, scale: number, white = false,
) => {
    context.save();
    context.globalAlpha = alpha;
    context.strokeStyle = white ? "#fff" : "#ffa45b";
    context.shadowColor = white ? "#fff" : "#ff7a27";
    context.shadowBlur = 5 * scale;
    context.lineWidth = 0.9 * scale;
    context.beginPath();
    context.moveTo(x - size * 2.7, y); context.lineTo(x + size * 2.7, y);
    context.moveTo(x, y - size * 2.7); context.lineTo(x, y + size * 2.7);
    context.stroke();
    context.fillStyle = white ? "#fff" : "#ffd4a6";
    context.beginPath(); context.arc(x, y, Math.max(0.45 * scale, size * 0.5), 0, Math.PI * 2); context.fill();
    context.restore();
};

interface ProtectedFailureField {
    time: number;
    x: number;
    restingY: number;
    lift: number;
    itemWidth: number;
    itemHeight: number;
    scale: number;
    sparks: readonly ProtectedFailureSpark[];
}

/** White central flash and orange four-point sparks following ballistic arcs. */
export const drawProtectedFailureEnding = (
    context: CanvasRenderingContext2D,
    { time, x, restingY, lift, itemWidth, itemHeight, scale, sparks }: ProtectedFailureField,
) => {
    const y = restingY - lift * remainingLift(time);
    const heat = ease((time - 0.3) / 0.8), restoration = 1 - ease((time - 1.8) / 1.65);
    glow(context, x, y, 54 * scale, heat * restoration * 0.16);
    if (time > 0.3 && time < 1.4) {
        const progress = clamp((time - 0.3) / 1.1);
        const flash = Math.pow(Math.sin(progress * Math.PI), 0.8);
        glow(context, x, y, (12 + progress * 42) * scale, flash * 0.57, "255,255,255");
        glow(context, x, y, (5 + progress * 10) * scale, flash * 0.65, "255,255,255");
        sparkle(context, x, y, (1.6 + progress * 7) * scale, flash * 0.9, scale, true);
    }
    for (const spark of sparks) {
        const age = time - spark.start;
        if (age <= 0 || age >= spark.life) continue;
        const progress = age / spark.life;
        const fade = Math.pow(1 - progress, 1.15) * ease(age / 0.09);
        // Freeze each origin at emission time; falling sparks do not follow the descending item.
        const birthX = x + (spark.x - 0.5) * itemWidth;
        const birthY = restingY - lift * remainingLift(spark.start) + (spark.y - 0.5) * itemHeight;
        const px = birthX + spark.vx * age * scale;
        const py = birthY + (spark.vy * age + 72 * age * age) * scale;
        for (let index = 0; index < 5; index++) {
            const start = Math.max(0, age - (5 - index) * 0.018);
            const end = Math.max(0, age - (4 - index) * 0.018);
            context.strokeStyle = `rgba(255,124,39,${fade * 0.27 * (index + 1) / 5})`;
            context.lineWidth = 0.7 * scale;
            context.beginPath();
            context.moveTo(birthX + spark.vx * start * scale, birthY + (spark.vy * start + 72 * start * start) * scale);
            context.lineTo(birthX + spark.vx * end * scale, birthY + (spark.vy * end + 72 * end * end) * scale);
            context.stroke();
        }
        sparkle(context, px, py, spark.size * scale, fade * (0.86 + 0.14 * Math.sin(age * 21 + spark.index)), scale);
        glow(context, px, py, spark.size * 4.3 * scale, fade * 0.16);
    }
};
