/** White-gold drawing primitives from the approved preview, without a scene background. */
export const highGlow = (
    context: CanvasRenderingContext2D, x: number, y: number, radius: number,
    alpha: number, color = "255,218,135",
) => {
    if (radius <= 0 || alpha <= 0) return;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${color},${alpha})`);
    gradient.addColorStop(0.28, `rgba(${color},${alpha * 0.35})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
};

export const highStar = (
    context: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number, scale: number,
) => {
    context.save();
    context.globalAlpha = alpha;
    context.strokeStyle = "#ffebbd";
    context.shadowColor = "#ffcc65";
    context.shadowBlur = 7 * scale;
    context.lineWidth = scale;
    context.beginPath();
    context.moveTo(x - radius * 2.7, y); context.lineTo(x + radius * 2.7, y);
    context.moveTo(x, y - radius * 2.7); context.lineTo(x, y + radius * 2.7);
    context.stroke();
    context.fillStyle = "#fffdf4";
    context.beginPath(); context.arc(x, y, Math.max(0.5 * scale, radius * 0.6), 0, Math.PI * 2); context.fill();
    context.restore();
};

export const easeOut = (value: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, value)), 3);
