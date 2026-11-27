import { clamp, ease } from "../item-low-level-upgrade/upgrade-visuals";
import { highGlow, highStar } from "./high-visuals";

const PREPARATION_SECONDS = 3.6;
const TURN = Math.PI * 2;

export const getHighPreparationFrame = (progress: number, time: number, lift: number) => {
    const chargeTime = clamp(progress) * PREPARATION_SECONDS;
    const energy = ease(progress);
    const amplitude = energy * 3.3;
    return {
        offset: lift * ease((chargeTime - 0.18) / 0.75),
        charge: ease((chargeTime - 0.4) / 2.1),
        dx: Math.sin(time * (36 + clamp(progress) * 18)) * amplitude,
        dy: Math.cos(time * (43 + clamp(progress) * 15)) * amplitude * 0.55,
        rotation: Math.sin(time * 37) * energy * 0.027,
    };
};

const drawVortex = (
    context: CanvasRenderingContext2D, time: number, energy: number,
    x: number, y: number, scale: number, front: boolean,
) => {
    const appearance = ease((time - 0.18) / 0.7);
    if (appearance <= 0) return;
    // Continue at peak speed while waiting, rather than accelerating indefinitely.
    const capped = Math.min(time, PREPARATION_SECONDS);
    const spin = capped * 1.1 + capped * capped * 0.6 + Math.max(0, time - capped) * (1.1 + capped * 1.2);
    const radius = (28 + energy * 36) * scale;
    const gradient = context.createLinearGradient(x, y - 98 * scale, x, y + 98 * scale);
    const color = `255,${Math.round(234 - energy * 12)},${Math.round(180 - energy * 30)}`;
    const alpha = (0.11 + energy * 0.32) * appearance;
    gradient.addColorStop(0, `rgba(${color},0)`);
    gradient.addColorStop(0.25, `rgba(${color},${alpha * 0.7})`);
    gradient.addColorStop(0.5, `rgba(${color},${alpha})`);
    gradient.addColorStop(0.75, `rgba(${color},${alpha * 0.7})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    context.save();
    context.strokeStyle = gradient;
    context.lineWidth = (0.9 + energy * 0.5) * scale;
    context.shadowColor = "#ffd56d";
    context.shadowBlur = 7 * scale;
    for (let strand = 0; strand < 2; strand++) {
        let previous: { x: number; y: number } | undefined;
        context.beginPath();
        for (let index = 0; index <= 150; index++) {
            const progress = index / 150;
            const angle = progress * TURN * 2.2 - spin + strand * Math.PI;
            const localRadius = radius * (0.62 + 0.38 * Math.sin(progress * Math.PI));
            const point = {
                x: x + Math.cos(angle) * localRadius,
                y: y + (progress - 0.5) * 156 * scale + Math.sin(angle) * localRadius * 0.19,
            };
            if (previous && (Math.sin(angle) > 0) === front) {
                context.moveTo(previous.x, previous.y); context.lineTo(point.x, point.y);
            }
            previous = point;
        }
        context.stroke();
    }
    context.restore();
};

const drawIncoming = (context: CanvasRenderingContext2D, time: number, x: number, y: number, scale: number) => {
    const capped = Math.min(time, PREPARATION_SECONDS);
    const clock = 0.45 * capped + 0.19 * capped ** 2 + 0.13 * capped ** 3
        + Math.max(0, time - capped) * (0.45 + 0.38 * capped + 0.39 * capped ** 2);
    // Only visit the active particles, including a bounded stream during pending.
    const first = Math.max(0, Math.floor((clock - 1.34) / 0.12));
    const last = Math.floor(clock / 0.12);
    for (let index = first; index <= last; index++) {
        const life = 1.1 + index % 4 * 0.08;
        const age = (clock - index * 0.12) / life;
        if (age <= 0 || age >= 1) continue;
        const angle = index * 2.399963 + age * 0.2, radius = 100 + index * 37 % 76;
        const remaining = 1 - ease(age);
        const px = x + Math.sin(angle) * 7 * scale + Math.cos(angle) * radius * remaining * scale;
        const py = y + (index * 19 % 124 - 62) * scale + Math.sin(angle) * radius * 0.63 * remaining * scale;
        const alpha = Math.sin(age * Math.PI) * 0.92;
        const tail = (5 + clamp(time / PREPARATION_SECONDS) * 11) * remaining * scale;
        context.strokeStyle = `rgba(255,224,151,${alpha * 0.28})`;
        context.lineWidth = 0.8 * scale;
        context.beginPath();
        context.moveTo(px + Math.cos(angle) * tail, py + Math.sin(angle) * tail);
        context.lineTo(px, py); context.stroke();
        highStar(context, px, py, (1.1 + index % 4 * 0.42) * scale, alpha, scale);
    }
};

/** Back and front passes wrap the actual item rather than drawing every wave over it. */
export const drawHighCharge = (
    context: CanvasRenderingContext2D, time: number, progress: number,
    x: number, y: number, scale: number, front: boolean,
) => {
    const energy = ease(progress);
    if (!front) {
        highGlow(context, x, y, 95 * scale, energy * 0.19);
        drawVortex(context, time, energy, x, y, scale, false);
        drawIncoming(context, time, x, y, scale);
        return;
    }
    drawVortex(context, time, energy, x, y, scale, true);
    const appearance = ease((progress - 0.1) / 0.2);
    const radius = (8 + energy * 23) * scale;
    const vibration = Math.sin(time * 71) * energy * 0.8 * scale;
    highGlow(context, x + vibration, y, radius * 1.7, appearance * 0.23);
    context.save();
    context.globalAlpha = appearance * 0.8;
    context.strokeStyle = "#ffedbd";
    context.shadowColor = "#ffd67d";
    context.shadowBlur = 7 * scale;
    context.lineWidth = 1.1 * scale;
    context.beginPath();
    context.arc(x + vibration, y, Math.max(0.1, radius + Math.sin(time * 57) * 0.4 * scale), 0, TURN);
    context.stroke(); context.restore();
    highStar(context, x + vibration, y, (2.2 + energy * 2.8) * scale, appearance, scale);
};
