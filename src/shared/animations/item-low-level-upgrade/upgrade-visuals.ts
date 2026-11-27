export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const ease = (value: number) => {
    const progress = clamp(value);
    return progress * progress * (3 - 2 * progress);
};

const PARTICLES = Array.from({ length: 46 }, (_, index) => ({
    angle: index * 2.399963, radius: 76 + index * 37 % 100,
    delay: 0.58 + (index * 19 % 120) / 100, life: 0.55 + index % 5 * 0.08,
    size: 1.1 + index % 4 * 0.45, target: index * 23 % 90 - 45,
}));

export const glow = (context: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number, color = "255,255,255") => {
    if (alpha <= 0 || radius <= 0) return;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${color},${alpha})`);
    gradient.addColorStop(0.25, `rgba(${color},${alpha * 0.36})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
};

export const sparkle = (context: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, gold = false) => {
    context.save();
    context.globalAlpha = alpha;
    context.strokeStyle = gold ? "#ffe4a3" : "#fff7df";
    context.lineWidth = 0.9;
    context.shadowColor = gold ? "#ffd16b" : "#fff";
    context.shadowBlur = 7;
    context.beginPath();
    context.moveTo(x - size * 2.7, y); context.lineTo(x + size * 2.7, y);
    context.moveTo(x, y - size * 2.7); context.lineTo(x, y + size * 2.7);
    context.stroke();
    context.fillStyle = "#fff";
    context.beginPath(); context.arc(x, y, size * 0.7, 0, Math.PI * 2); context.fill();
    context.restore();
};

export const drawCharge = (context: CanvasRenderingContext2D, time: number, x: number, y: number, scale: number, gold = false) => {
    const charge = ease((time - 0.6) / 1.55) * (1 - ease((time - 2.52) / 0.5));
    glow(context, x, y, 76 * scale, charge * 0.16, gold ? "255,235,184" : "255,255,255");
    for (const particle of PARTICLES) {
        const progress = (time - particle.delay) / particle.life;
        if (progress <= 0 || progress >= 1) continue;
        const remaining = 1 - ease(progress);
        const angle = particle.angle + progress * 0.18;
        const px = x + Math.sin(particle.angle) * 5 * scale + Math.cos(angle) * particle.radius * remaining * scale;
        const py = y + particle.target * scale + Math.sin(angle) * particle.radius * 0.65 * remaining * scale;
        const alpha = Math.sin(progress * Math.PI) * 0.9;
        context.strokeStyle = `rgba(255,244,218,${alpha * 0.23})`;
        context.lineWidth = 0.8;
        context.beginPath();
        context.moveTo(px + Math.cos(angle) * 7 * remaining * scale, py + Math.sin(angle) * 5 * remaining * scale);
        context.lineTo(px, py); context.stroke();
        sparkle(context, px, py, particle.size * scale, alpha, gold);
    }
};
