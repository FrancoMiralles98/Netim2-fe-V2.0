import { clamp, ease, glow, sparkle } from "../item-low-level-upgrade/upgrade-visuals";

const STARS = Array.from({ length: 14 }, (_, index) => ({
    angle: index * Math.PI * 2 / 14 + (index % 3 - 1) * 0.06,
    radius: 42 + index * 17 % 35,
    delay: 0.045 + index % 3 * 0.02,
    size: 1.6 + index % 4 * 0.45,
}));

export const getModerateSuccessFrame = (progress: number, lift: number) => ({
    time: 2.3 + progress * 1.25,
    offset: lift * (1 - ease((progress - 0.32) / 0.62)),
    charge: 1 - ease((progress - 0.18) / 0.3),
});

/** Outward stars stop near the charged position, remaining there while the item descends. */
export const drawModerateSuccessEnding = (
    context: CanvasRenderingContext2D, progress: number, x: number, y: number, scale: number,
) => {
    const flash = Math.sin(clamp(progress / 0.25) * Math.PI);
    if (progress < 0.25) {
        glow(context, x, y, (105 + flash * 22) * scale, flash * 0.78, "255,205,91");
        glow(context, x, y, 43 * scale, flash * 0.92, "255,242,209");
        sparkle(context, x, y, (20 + flash * 12) * scale, flash, true);
        context.save();
        context.globalAlpha = flash * 0.82;
        context.strokeStyle = "#ffe0a0";
        context.shadowColor = "#ffd16b";
        context.shadowBlur = 11 * scale;
        context.lineWidth = 1.2 * scale;
        context.beginPath();
        context.moveTo(x - 38 * scale, y - 38 * scale); context.lineTo(x + 38 * scale, y + 38 * scale);
        context.moveTo(x + 38 * scale, y - 38 * scale); context.lineTo(x - 38 * scale, y + 38 * scale);
        context.stroke(); context.restore();
    }
    for (let index = 0; index < STARS.length; index++) {
        const star = STARS[index];
        const age = progress - star.delay;
        if (age <= 0) continue;
        const travel = ease(age / 0.22);
        const fade = 1 - ease((progress - 0.67) / 0.33);
        const alpha = ease(age / 0.045) * fade * (0.78 + Math.sin(progress * 44 + index * 1.7) * 0.22);
        const radius = star.radius * travel * scale;
        const sx = x + Math.cos(star.angle) * radius;
        const sy = y + Math.sin(star.angle) * radius * 0.85;
        if (travel < 1) {
            context.strokeStyle = `rgba(255,221,143,${alpha * 0.24})`;
            context.lineWidth = scale;
            context.beginPath();
            context.moveTo(sx - Math.cos(star.angle) * 9 * scale, sy - Math.sin(star.angle) * 7 * scale);
            context.lineTo(sx, sy); context.stroke();
        }
        sparkle(context, sx, sy, star.size * scale, alpha, true);
        glow(context, sx, sy, star.size * 5 * scale, alpha * 0.21, "255,218,133");
    }
};
