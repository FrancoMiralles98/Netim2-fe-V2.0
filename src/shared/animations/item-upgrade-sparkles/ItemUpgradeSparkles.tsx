import type { CSSProperties } from "react";
import "./item-upgrade-sparkles.css";

interface ItemUpgradeSparklesProps {
    className?: string;
    style?: CSSProperties;
    layer?: "above" | "below";
    paused?: boolean;
}

type SparkleStyle = CSSProperties & {
    "--sparkle-x": string;
    "--sparkle-size": string;
    "--sparkle-duration": string;
    "--sparkle-blink": string;
    "--sparkle-delay": string;
    "--sparkle-drift": string;
};

// Deterministic offsets keep the approved preview's timing stable across renders.
const ANIMATION_SPEED = 0.49;

const SPARKLES = Array.from({ length: 18 }, (_, index): { cross: boolean; style: SparkleStyle } => ({
    cross: index % 3 === 0,
    style: {
        "--sparkle-x": `${((index * 17) % 26) / 30 * 100}%`,
        "--sparkle-size": `${index % 3 === 0 ? 7 : 3 + index % 3}px`,
        "--sparkle-duration": `${(0.85 + index % 7 * 0.08) / ANIMATION_SPEED}s`,
        "--sparkle-blink": `${(0.24 + index % 5 * 0.047) / ANIMATION_SPEED}s`,
        "--sparkle-delay": `${-index * 0.173 / ANIMATION_SPEED}s`,
        "--sparkle-drift": `${(index * 13) % 7 - 3}px`,
    } satisfies SparkleStyle,
}));

/** White central sparkles that repeatedly flicker while rising over an item. */
export const ItemUpgradeSparkles = ({
    className = "",
    style,
    layer = "above",
    paused = false,
}: ItemUpgradeSparklesProps) => (
    <span
        aria-hidden="true"
        className={`item-upgrade-sparkles ${className}`}
        data-layer={layer}
        data-paused={paused}
        style={style}
    >
        <span className="item-upgrade-sparkles__field">
            {SPARKLES.map((sparkle, index) => (
                <span
                    key={index}
                    className="item-upgrade-sparkles__particle"
                    data-cross={sparkle.cross}
                    style={sparkle.style}
                >
                    <span className="item-upgrade-sparkles__flash" />
                </span>
            ))}
        </span>
    </span>
);
