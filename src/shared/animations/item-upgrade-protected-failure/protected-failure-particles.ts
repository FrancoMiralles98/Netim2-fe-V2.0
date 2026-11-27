interface Origin {
    /** Coordinates normalized to the image itself, not its containing slot. */
    x: number;
    y: number;
}

export interface ProtectedFailureSpark extends Origin {
    index: number;
    start: number;
    life: number;
    vx: number;
    vy: number;
    size: number;
}

const sampleOrigins = (image: HTMLImageElement): Origin[] => {
    const fallback = Array.from({ length: 64 }, (_, index) => ({
        x: 0.5 + Math.sin(index * 2.399963) * 0.16,
        y: (index + 0.5) / 64,
    }));
    if (!image.naturalWidth || !image.naturalHeight) return fallback;
    const sample = document.createElement("canvas");
    const ratio = 96 / Math.max(image.naturalWidth, image.naturalHeight);
    sample.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    sample.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const context = sample.getContext("2d", { willReadFrequently: true });
    if (!context) return fallback;
    try {
        // Read only this isolated canvas; a cross-origin image never taints the effect layers.
        context.drawImage(image, 0, 0, sample.width, sample.height);
        const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
        const rows: { y: number; xs: number[] }[] = [];
        for (let y = 0; y < sample.height; y++) {
            const xs: number[] = [];
            for (let x = 0; x < sample.width; x++) {
                if (pixels[(y * sample.width + x) * 4 + 3] > 150) xs.push(x);
            }
            if (xs.length) rows.push({ y, xs });
        }
        if (!rows.length) return fallback;
        return Array.from({ length: 64 }, (_, index) => {
            const row = rows[Math.min(rows.length - 1, Math.floor((index + 0.5) / 64 * rows.length))];
            return {
                x: (row.xs[index * 7 % row.xs.length] + 0.5) / sample.width,
                y: (row.y + 0.5) / sample.height,
            };
        });
    } catch {
        // Missing pixel access (for example CORS) must not cancel a valid visual result.
        return fallback;
    }
};

/** Sample once when this ending is selected; resizing reuses normalized origins. */
export const createProtectedFailureSparks = (image: HTMLImageElement): ProtectedFailureSpark[] => (
    sampleOrigins(image).map((origin, index) => {
        const angle = index * 2.399963;
        const speed = 65 + index * 19 % 49;
        return {
            ...origin,
            index,
            start: 1.12 + (index * 17 % 70) / 100,
            life: 1.05 + index % 5 * 0.09,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed * 0.55 - 48,
            size: 0.95 + index % 4 * 0.4,
        };
    })
);
