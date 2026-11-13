import { useId, useState, type CSSProperties } from "react";
import type { ItemDTO } from "netim2-shared";
import { ItemLegendaryImage } from "../item-legendary-halo/ItemLegendaryImage";
import "./item-special-sweep.css";

interface ItemSpecialImageProps {
    item: ItemDTO;
    src: string;
    alt: string;
    className?: string;
    style?: CSSProperties;
}

const SWEEP_DURATION = 1.6;
const SAMPLE_MAX_SIZE = 128;

const readSilhouette = (image: HTMLImageElement) => {
    const { naturalWidth: width, naturalHeight: height } = image;
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, SAMPLE_MAX_SIZE / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) return { width, height, tip: null };

    try {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < canvas.height; y++) {
            let left = canvas.width;
            let right = -1;
            for (let x = 0; x < canvas.width; x++) {
                if (data[(y * canvas.width + x) * 4 + 3] <= 175) continue;
                left = Math.min(left, x);
                right = x;
            }
            if (right >= 0) {
                return { width, height, tip: {
                    x: (left + right + 1) / 2 / canvas.width * width,
                    y: (y + .5) / canvas.height * height,
                } };
            }
        }
    } catch {
        // Cross-origin images can still show the sweep without a sampled flash.
    }
    return { width, height, tip: null };
};

const SpecialSweepImage = ({ src, alt, className, style }: Omit<ItemSpecialImageProps, "item">) => {
    const maskId = useId();
    const gradientId = useId();
    const [silhouette, setSilhouette] = useState<ReturnType<typeof readSilhouette>>();
    const sweepStyle = { ...style, "--item-special-duration": `${SWEEP_DURATION}s` } as CSSProperties;

    return (
        <span className={`item-special-image ${className ?? ""}`} style={sweepStyle}>
            <img
                className="item-special-image__base"
                src={src}
                alt={alt}
                onLoad={({ currentTarget }) => setSilhouette(readSilhouette(currentTarget))}
            />
            {silhouette && (
                <svg
                    className="item-special-image__effect"
                    viewBox={`0 0 ${silhouette.width} ${silhouette.height}`}
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={silhouette.width} height={silhouette.height} style={{ maskType: "alpha" }}>
                            <image href={src} width={silhouette.width} height={silhouette.height} />
                        </mask>
                        <linearGradient id={gradientId} x2="0%" y2="100%">
                            <stop offset="0" stopColor="white" stopOpacity="0" />
                            <stop offset="40%" stopColor="white" />
                            <stop offset="60%" stopColor="white" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <g mask={`url("#${maskId}")`}>
                        <rect
                            className="item-special-image__line"
                            x="0"
                            y={-silhouette.height * .045}
                            width={silhouette.width}
                            height={silhouette.height * .09}
                            fill={`url("#${gradientId}")`}
                        />
                    </g>
                    {silhouette.tip && (
                        <g transform={`translate(${silhouette.tip.x} ${silhouette.tip.y})`}>
                            <g
                                className="item-special-image__flash"
                                style={{ animationDelay: `${SWEEP_DURATION * (.08 + .64 * (1 - silhouette.tip.y / silhouette.height) - .54)}s` }}
                            >
                                <circle r="1.2" fill="white" />
                                <path d="M-4 0H4M0-4V4" stroke="white" strokeWidth=".8" strokeLinecap="round" />
                            </g>
                        </g>
                    )}
                </svg>
            )}
        </span>
    );
};

export const ItemSpecialImage = ({ item, ...image }: ItemSpecialImageProps) => (
    item.type === "equip" && item.especial === true
        ? <SpecialSweepImage key={image.src} {...image} />
        : <ItemLegendaryImage item={item} {...image} />
);
