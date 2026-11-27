import { clamp, ease, glow, sparkle } from "./upgrade-visuals";

/** Original success ending, using the approved preview's 2.3–3.55 second timeline. */
export const getSuccessFrame = (progress: number, lift: number) => {
    const time = 2.3 + progress * 1.25;
    return {
        time,
        offset: lift * (1 - ease((time - 2.62) / 0.72)),
        charge: 1 - ease((time - 2.52) / 0.5),
    };
};

export const drawSuccessEnding = (context: CanvasRenderingContext2D, time: number, x: number, y: number, scale: number) => {
    if (time > 2.3 && time < 2.54) {
        const flash = Math.sin(clamp((time - 2.3) / 0.24) * Math.PI);
        glow(context, x, y, (61 + flash * 16) * scale, flash * 0.8);
        context.save();
        context.globalAlpha = flash * 0.85;
        context.strokeStyle = "#fff";
        context.shadowColor = "#fff";
        context.shadowBlur = 10;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(x - 48 * scale, y); context.lineTo(x + 48 * scale, y);
        context.moveTo(x, y - 66 * scale); context.lineTo(x, y + 66 * scale);
        context.stroke(); context.restore();
        glow(context, x, y, 18 * scale, flash);
    }
    if (time > 2.5 && time < 3) {
        const progress = (time - 2.5) / 0.5;
        for (let index = 0; index < 6; index++) {
            const angle = index * Math.PI / 3;
            sparkle(context, x + Math.cos(angle) * (15 + progress * 25) * scale,
                y + Math.sin(angle) * (25 + progress * 20) * scale, 0.8 * scale, (1 - progress) * 0.45);
        }
    }
};
