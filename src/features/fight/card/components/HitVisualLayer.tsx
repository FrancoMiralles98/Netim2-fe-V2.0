import { useLayoutEffect, useRef, type CSSProperties } from "react";
import type { HitVisual } from "../../animations/animations.types";
import { CombatFloatingValue } from "./CombatFloatingValue";

interface HitVisualLayerProps {
    visuals: HitVisual[];
    fighterId: string;
    paused: boolean;
    speed: number;
}

export const HitVisualLayer = ({ visuals, fighterId, paused, speed }: HitVisualLayerProps) => {
    const layerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        for (const animation of layerRef.current?.getAnimations({ subtree: true }) ?? []) {
            if (animation.playbackRate !== speed) animation.updatePlaybackRate(speed);
        }
    }, [speed, visuals]);

    return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-[75]">
        {visuals.filter(visual => visual.fighterId === fighterId).map(visual => (
            <div key={visual.id} className="pointer-events-none absolute inset-0 z-[75]" style={{
                transform: `translateY(${visual.lane * 24 - 48}px)`,
                "--fight-damage-duration": "1000ms",
                "--fight-resource-duration": "1000ms",
            } as CSSProperties}>
                {visual.type === "value" ? (
                    <CombatFloatingValue animation={visual.animation} paused={paused} />
                ) : (
                    <span
                        className={`absolute top-1/2 left-1/2 inline-flex items-center gap-3 whitespace-nowrap text-sm font-bold drop-shadow-lg animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards] ${visual.colorClass}`}
                        style={{ animationPlayState: paused ? "paused" : "running" }}
                    >
                        {visual.parts
                            ? visual.parts.map((part, index) => <span key={index} className={part.colorClass}>{part.text}</span>)
                            : visual.text}
                    </span>
                )}
            </div>
        ))}
    </div>
    );
};
