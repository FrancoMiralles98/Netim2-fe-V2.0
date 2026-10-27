import type { CSSProperties } from "react";
import "./item-static-sparkles.css";

interface ItemStaticSparklesProps {
    variant?: "petrol" | "bronze";
    className?: string;
    style?: CSSProperties;
    layer?: "above" | "below";
    paused?: boolean;
}

type StaticSparkleStyle = CSSProperties & {
    "--static-sparkle-x": string;
    "--static-sparkle-y": string;
    "--static-sparkle-size": string;
    "--static-sparkle-blink": string;
    "--static-sparkle-delay": string;
};

const ANIMATION_SPEED = 0.49 / 1.5;

// Match the approved preview with fixed positions and independent flickering.
const createSparkles = (count: number, speed: number) => Array.from({ length: count }, (_, index): { cross: boolean; style: StaticSparkleStyle } => ({
    cross: index % 3 === 0,
    style: {
        "--static-sparkle-x": `${((index * 17) % 26) / 30 * 100}%`,
        "--static-sparkle-y": `${(5 + (index * 43) % 116) / 130 * 100}%`,
        "--static-sparkle-size": `${index % 3 === 0 ? 7 : 3 + index % 3}px`,
        "--static-sparkle-blink": `${(0.24 + index % 5 * 0.047) / speed}s`,
        "--static-sparkle-delay": `${-index * 0.173 / speed}s`,
    },
}));

const SPARKLES_BY_VARIANT = {
    petrol: createSparkles(14, ANIMATION_SPEED),
    bronze: createSparkles(6, ANIMATION_SPEED / 1.5),
};

/** Stationary sparkles: petrol blue for +8, fewer and slower bronze flashes for +7. */
export const ItemStaticSparkles = ({
    variant = "petrol",
    className = "",
    style,
    layer = "above",
    paused = false,
}: ItemStaticSparklesProps) => (
    <span
        aria-hidden="true"
        className={`item-static-sparkles ${className}`}
        data-layer={layer}
        data-variant={variant}
        data-paused={paused}
        style={style}
    >
        <span className="item-static-sparkles__field">
            {SPARKLES_BY_VARIANT[variant].map((sparkle, index) => (
                <span
                    key={index}
                    className="item-static-sparkles__particle"
                    data-cross={sparkle.cross}
                    style={sparkle.style}
                >
                    <span className="item-static-sparkles__flash" />
                </span>
            ))}
        </span>
    </span>
);
