import { useEffect, useRef, type CSSProperties, type ReactEventHandler } from "react";
import { createLowLevelUpgradeAnimation, type LowLevelUpgradeAnimation, type ItemLowLevelUpgradeResult } from "./upgrade-renderer";
import { FRAGMENTS } from "./failure-ending";
import "./item-low-level-upgrade.css";

export type { ItemLowLevelUpgradeResult } from "./upgrade-renderer";

export interface UpgradeEffectViewProps {
    tier: "low" | "moderate" | "high";
    /** Internal: render only a selected ending, beginning charged and elevated. */
    skipPreparation?: boolean;
    src: string;
    alt: string;
    /** Pending holds the charged item until a confirmed result arrives. */
    result?: ItemLowLevelUpgradeResult;
    width?: number;
    height?: number;
    preparationDuration?: number;
    /** Tier-specific success; destructive failure 1850 ms; protected failure 4300 ms. */
    endingDuration?: number;
    liftDistance?: number;
    active?: boolean;
    paused?: boolean;
    className?: string;
    style?: CSSProperties;
    onComplete?: () => void;
    onError?: ReactEventHandler<HTMLImageElement>;
}

/** Internal view shared by the low, moderate, and high upgrade effects. */
export const UpgradeEffectView = ({
    tier, skipPreparation = false,
    src, alt, result = "pending", width = 64, height = 192,
    preparationDuration = 2300, endingDuration, liftDistance = 32,
    active = true, paused = false, className = "", style, onComplete, onError,
}: UpgradeEffectViewProps) => {
    const root = useRef<HTMLSpanElement>(null);
    const moving = useRef<HTMLSpanElement>(null);
    const intact = useRef<HTMLSpanElement>(null);
    const image = useRef<HTMLImageElement>(null);
    const silhouette = useRef<HTMLSpanElement>(null);
    const cuts = useRef<HTMLSpanElement>(null);
    const fragments = useRef<HTMLSpanElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const backdrop = useRef<HTMLCanvasElement>(null);
    const animation = useRef<LowLevelUpgradeAnimation | null>(null);
    const completion = useRef(onComplete);

    useEffect(() => { completion.current = onComplete; }, [onComplete]);

    useEffect(() => {
        if (!active || !root.current || !moving.current || !intact.current || !image.current ||
            !silhouette.current || !cuts.current || !fragments.current || !canvas.current || (tier === "high" && !backdrop.current)) return;
        const sequence = createLowLevelUpgradeAnimation({
            root: root.current, moving: moving.current, intact: intact.current,
            image: image.current, silhouette: silhouette.current, cuts: cuts.current,
            fragments: fragments.current, canvas: canvas.current,
            backdrop: backdrop.current ?? undefined,
            preparationDuration, endingDuration, liftDistance, tier, skipPreparation,
            onComplete: () => completion.current?.(),
        });
        animation.current = sequence;
        return () => { sequence.dispose(); animation.current = null; };
    }, [src, active, preparationDuration, endingDuration, liftDistance, tier, skipPreparation]);

    useEffect(() => {
        animation.current?.setResult(result);
        animation.current?.setPaused(paused);
    }, [src, active, preparationDuration, endingDuration, liftDistance, tier, skipPreparation, result, paused]);

    const mask: CSSProperties = {
        maskImage: `url(${JSON.stringify(src)})`,
        WebkitMaskImage: `url(${JSON.stringify(src)})`,
    };

    return (
        <span ref={root} className={`item-low-level-upgrade ${className}`} data-tier={tier} style={{
            width: Number.isFinite(width) && width > 0 ? width : 64,
            height: Number.isFinite(height) && height > 0 ? height : 192,
            ...style,
        }}>
            {tier === "high" && <canvas ref={backdrop} className="item-low-level-upgrade__particles item-low-level-upgrade__particles--back" aria-hidden="true" />}
            <span ref={moving} className="item-low-level-upgrade__moving">
                <span ref={intact} className="item-low-level-upgrade__intact">
                    <img ref={image} src={src} alt={alt} draggable={false} onError={onError} />
                    <span ref={silhouette} className="item-low-level-upgrade__silhouette" style={mask} aria-hidden="true" />
                    <span ref={cuts} className="item-low-level-upgrade__cuts" style={mask} aria-hidden="true">
                        {Array.from({ length: 5 }, (_, index) => <span key={index} />)}
                    </span>
                </span>
                <span ref={fragments} className="item-low-level-upgrade__fragments" aria-hidden="true">
                    {FRAGMENTS.map((fragment, index) => (
                        <span key={index} className="item-low-level-upgrade__fragment" style={{ transformOrigin: `${fragment.cx}% ${fragment.cy}%` }}>
                            <span style={{ ...mask, clipPath: fragment.clip }} />
                        </span>
                    ))}
                </span>
            </span>
            <canvas ref={canvas} className="item-low-level-upgrade__particles" aria-hidden="true" />
        </span>
    );
};
