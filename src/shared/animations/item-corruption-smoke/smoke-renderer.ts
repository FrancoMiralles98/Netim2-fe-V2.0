const WIDTH = 128;
const HEIGHT = 184;
const FRAME_INTERVAL = 1000 / 22;
const targets = new Set<CanvasRenderingContext2D>();

// Cache the noise lattice; every visible item shares the same rendered frame.
const lattice = Float32Array.from({ length: 256 * 256 }, (_, index) => {
    const x = index % 256 - 128;
    const y = Math.floor(index / 256) - 128;
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return value - Math.floor(value);
});

let source: HTMLCanvasElement | null = null;
let sourceContext: CanvasRenderingContext2D | null = null;
let pixels: ImageData | null = null;
let animationId: number | null = null;
let lastFrame: number | null = null;
let time = 18;

const hash = (x: number, y: number) => lattice[((y + 128) & 255) * 256 + ((x + 128) & 255)];

const noise = (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy), b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
};

const fbm = (x: number, y: number) => noise(x, y) * 0.55
    + noise(x * 2.03 + 13, y * 2.03 + 7) * 0.28
    + noise(x * 4.07 + 9, y * 4.07 + 17) * 0.17;

const renderFrame = () => {
    if (!source) {
        source = document.createElement("canvas");
        source.width = WIDTH;
        source.height = HEIGHT;
        sourceContext = source.getContext("2d");
        pixels = sourceContext?.createImageData(WIDTH, HEIGHT) ?? null;
    }
    if (!sourceContext || !pixels) return;

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const nx = (x - WIDTH / 2) / (WIDTH / 2);
            const ny = (y - HEIGHT / 2) / (HEIGHT / 2);
            const warp = fbm(nx * 2 + time * 0.08, ny * 2 - time * 0.11);
            const density = fbm(nx * 4 + warp * 2.7 + time * 0.05, ny * 4 + warp * 2.2 + time * 0.22);
            // Keep smoke across the full item, fading only near its edges.
            const edgeX = Math.min(1, Math.max(0, (1 - Math.abs(nx)) / 0.22));
            const edgeY = Math.min(1, Math.max(0, (1 - Math.abs(ny)) / 0.22));
            const envelope = edgeX * edgeX * (3 - 2 * edgeX)
                * edgeY * edgeY * (3 - 2 * edgeY);
            const wisps = Math.max(0, (density - 0.36) * 2.4);
            const index = (y * WIDTH + x) * 4;
            pixels.data[index] = 225;
            pixels.data[index + 1] = 48;
            pixels.data[index + 2] = 48;
            pixels.data[index + 3] = Math.min(200, wisps * envelope * 250);
        }
    }
    sourceContext.putImageData(pixels, 0, 0);
};

const paint = (context: CanvasRenderingContext2D) => {
    if (!source) return;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.drawImage(source, 0, 0, context.canvas.width, context.canvas.height);
};

const animate = (now: number) => {
    if (lastFrame === null || now - lastFrame >= FRAME_INTERVAL) {
        if (lastFrame !== null) time += Math.min((now - lastFrame) / 1000, 0.08);
        renderFrame();
        targets.forEach(paint);
        lastFrame = now;
    }
    animationId = requestAnimationFrame(animate);
};

export const showStillSmoke = (context: CanvasRenderingContext2D) => {
    if (!source) renderFrame();
    paint(context);
};

export const subscribeSmoke = (context: CanvasRenderingContext2D) => {
    showStillSmoke(context);
    targets.add(context);
    if (animationId === null) {
        lastFrame = null;
        animationId = requestAnimationFrame(animate);
    }
    return () => {
        targets.delete(context);
        if (targets.size === 0 && animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
            lastFrame = null;
        }
    };
};
