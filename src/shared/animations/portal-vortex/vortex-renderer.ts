export const VORTEX_SIZE = 340;

const CENTER = VORTEX_SIZE / 2;
const TURN = 2 * Math.PI;
const FRAME_INTERVAL = 1000 / 30;
const RIBBON_RADIUS = 148;
const CORE_RADIUS = 62;
const SPARK_SIZE_SCALE = 0.4;
const RIBBON_SEGMENTS = 36;
const targets = new Set<CanvasRenderingContext2D>();

// Cache each tapered outline once. Drawing a strand only requires rotation and scale.
const createRibbon = (sweep: number, contraction: number, width: number) => {
    const path = new Path2D();
    for (let side = 0; side < 2; side++) {
        for (let index = 0; index <= RIBBON_SEGMENTS; index++) {
            const step = (side === 0 ? index : RIBBON_SEGMENTS - index) / RIBBON_SEGMENTS;
            const theta = step * sweep;
            const envelope = Math.sin(Math.PI * step);
            const radius = RIBBON_RADIUS * (1 - contraction * step) + Math.sin(step * 15) * 1.7 * envelope;
            const taper = envelope ** 1.3 * (0.67 + 0.33 * step);
            const offset = width * taper / 2 * (side === 0 ? 1 : -1);
            const x = Math.cos(theta) * (radius + offset);
            const y = Math.sin(theta) * (radius + offset);
            if (side === 0 && index === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
        }
    }
    path.closePath();
    return path;
};

const createRenderer = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = VORTEX_SIZE;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const mist = context.createRadialGradient(CENTER, CENTER, 18, CENTER, CENTER, 144);
    mist.addColorStop(0, "rgba(37, 8, 52, .96)");
    mist.addColorStop(0.32, "rgba(86, 9, 55, .87)");
    mist.addColorStop(0.58, "rgba(146, 9, 59, .59)");
    mist.addColorStop(0.8, "rgba(133, 34, 109, .14)");
    mist.addColorStop(1, "rgba(151, 38, 101, 0)");

    const core = context.createRadialGradient(CENTER, CENTER, 8, CENTER, CENTER, CORE_RADIUS);
    core.addColorStop(0, "rgba(7, 3, 16, 1)");
    core.addColorStop(0.39, "rgba(11, 4, 23, .99)");
    core.addColorStop(0.71, "rgba(21, 5, 34, .66)");
    core.addColorStop(1, "rgba(21, 5, 34, 0)");

    return {
        canvas,
        context,
        mist,
        core,
        tip: createRibbon(1.05, 0.18, 11),
        outerRibbon: createRibbon(2.73, 0.55, 30),
        innerRibbon: createRibbon(2.73, 0.55, 15),
    };
};

let renderer: ReturnType<typeof createRenderer> | undefined;
let animationId: number | undefined;
let nextFrame: number | undefined;
let previousFrame: number | undefined;
let time = 0.74;

const setRibbonTransform = (context: CanvasRenderingContext2D, radius: number, angle: number) => {
    const scale = radius / RIBBON_RADIUS;
    const cos = Math.cos(angle) * scale;
    const sin = Math.sin(angle) * scale;
    context.setTransform(cos, sin * 0.96, -sin, cos * 0.96, CENTER, CENTER);
};

const renderFrame = () => {
    if (renderer === undefined) renderer = createRenderer();
    if (!renderer) return;
    const { context, mist, core, tip, outerRibbon, innerRibbon } = renderer;
    const rotation = time * 0.6;

    context.clearRect(0, 0, VORTEX_SIZE, VORTEX_SIZE);
    context.fillStyle = mist;
    context.fillRect(0, 0, VORTEX_SIZE, VORTEX_SIZE);

    for (let index = 0; index < 7; index++) {
        const radius = 153 + 4 * Math.sin(index * 2.1 + time * 1.4);
        setRibbonTransform(context, radius, index * TURN / 7 + rotation);
        context.fillStyle = index % 3 === 0 ? "rgba(196, 9, 62, .36)" : "rgba(117, 33, 204, .40)";
        context.fill(tip);
    }

    for (let arm = 0; arm < 3; arm++) {
        const angle = arm * TURN / 3 + rotation;
        for (let strand = 0; strand < 11; strand++) {
            const phase = (time * (0.21 + strand * 0.004) + strand / 11 + arm * 0.11) % 1;
            const fade = Math.sin(phase * Math.PI);
            setRibbonTransform(context, RIBBON_RADIUS - 100 * phase, angle + strand * 0.057 + phase * 1.24);
            context.fillStyle = strand >= 7 ? "#8d2fe4" : "#dc0839";
            context.globalAlpha = 0.15 * fade;
            context.fill(outerRibbon);
            context.globalAlpha = 0.27 * fade;
            context.fill(innerRibbon);
        }
    }

    context.resetTransform();
    context.globalAlpha = 1;
    context.fillStyle = core;
    context.fillRect(CENTER - CORE_RADIUS, CENTER - CORE_RADIUS, CORE_RADIUS * 2, CORE_RADIUS * 2);

    context.strokeStyle = "#fffaff";
    context.lineCap = "round";
    for (let index = 0; index < 20; index++) {
        const age = (time * (0.49 + (index % 5) * 0.04) + index * 0.183) % 1;
        if (age >= 0.66) continue;

        const progress = age / 0.66;
        const reach = 118 + (index % 7) * 6;
        const distance = 8 + (reach - 8) * (1 - progress);
        const angle = index * 2.39996 + time * 0.22 + progress * 0.94;
        const tail = distance + (4 + (index % 4) * 2.2) * SPARK_SIZE_SCALE;
        const tailAngle = angle - 0.038 * SPARK_SIZE_SCALE;
        const fade = 1 - Math.max(0, (progress - 0.52) / 0.48);
        context.globalAlpha = 0.94 * Math.min(1, progress * 17) * fade ** 1.6;
        context.lineWidth = (0.8 + fade * 1.3) * SPARK_SIZE_SCALE;
        context.beginPath();
        context.moveTo(CENTER + tail * Math.cos(tailAngle), CENTER + tail * Math.sin(tailAngle));
        context.lineTo(CENTER + distance * Math.cos(angle), CENTER + distance * Math.sin(angle));
        context.stroke();
    }
    context.globalAlpha = 1;
};

const paint = (context: CanvasRenderingContext2D) => {
    if (!renderer) return;
    context.clearRect(0, 0, VORTEX_SIZE, VORTEX_SIZE);
    context.drawImage(renderer.canvas, 0, 0);
};

const animate = (now: number) => {
    if (nextFrame === undefined || now >= nextFrame) {
        if (previousFrame !== undefined) time += Math.min((now - previousFrame) / 1000, 0.08);
        renderFrame();
        targets.forEach(paint);
        previousFrame = now;
        // Keep the 30 FPS cadence even when display refresh does not divide evenly.
        nextFrame = nextFrame === undefined || now - nextFrame >= FRAME_INTERVAL
            ? now + FRAME_INTERVAL
            : nextFrame + FRAME_INTERVAL;
    }
    animationId = requestAnimationFrame(animate);
};

export const paintStillVortex = (context: CanvasRenderingContext2D) => {
    if (renderer === undefined) renderFrame();
    paint(context);
};

export const subscribeVortex = (context: CanvasRenderingContext2D) => {
    paintStillVortex(context);
    if (!renderer) return;

    targets.add(context);
    animationId ??= requestAnimationFrame(animate);

    return () => {
        targets.delete(context);
        if (targets.size === 0 && animationId !== undefined) {
            cancelAnimationFrame(animationId);
            animationId = nextFrame = previousFrame = undefined;
        }
    };
};
