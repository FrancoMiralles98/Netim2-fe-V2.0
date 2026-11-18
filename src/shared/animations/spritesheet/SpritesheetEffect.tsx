import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import "./spritesheet-effect.css";

export interface SpritesheetConfig {
    src: string;
    columns: number;
    rows: number;
    frameCount: number;
    fps: number;
    /** Relative time per frame, preserving the total frameCount/fps duration. */
    frameWeights?: readonly number[];
}

export interface SpritesheetEffectProps {
    sheet: SpritesheetConfig;
    paused?: boolean;
    speed?: number;
    loop?: boolean;
    direction?: "normal" | "alternate";
    className?: string;
    style?: CSSProperties;
}

/** Remount with a new key to replay a one-shot sequence. */
export const SpritesheetEffect = ({
    sheet,
    paused = false,
    speed = 1,
    loop = false,
    direction = "normal",
    className = "",
    style,
}: SpritesheetEffectProps) => {
    const element = useRef<HTMLSpanElement>(null);
    const animation = useRef<Animation | null>(null);

    useEffect(() => {
        const node = element.current;
        if (!node) return;

        const forward = Array.from({ length: sheet.frameCount }, (_, index) => index);
        // Exclude both endpoints on the return pass: ...23,24,23...2,1,2...
        const order = direction === "alternate"
            ? [...forward, ...forward.slice(1, -1).reverse()]
            : forward;
        const weights = order.map(index => {
            const weight = sheet.frameWeights?.[index] ?? 1;
            return Number.isFinite(weight) && weight > 0 ? weight : 1;
        });
        const totalWeight = weights.reduce((total, weight) => total + weight, 0);
        let elapsedWeight = 0;
        const frames: Keyframe[] = order.map((frameIndex, index) => {
            const column = frameIndex % sheet.columns;
            const row = Math.floor(frameIndex / sheet.columns);
            const x = column * 100 / Math.max(1, sheet.columns - 1);
            const y = row * 100 / Math.max(1, sheet.rows - 1);

            const frame = {
                backgroundPosition: `${x}% ${y}%`,
                opacity: 1,
                offset: elapsedWeight / totalWeight,
                easing: "steps(1, end)",
            };
            elapsedWeight += weights[index];
            return frame;
        });
        frames.push({
            ...(loop ? frames[0] : frames[frames.length - 1]),
            opacity: loop ? 1 : 0,
            offset: 1,
        });
        const sequence = node.animate(frames, {
            duration: order.length / sheet.fps * 1000,
            fill: "forwards",
            iterations: loop ? Infinity : 1,
        });
        animation.current = sequence;

        return () => {
            sequence.cancel();
            animation.current = null;
        };
    }, [sheet, loop, direction]);

    useEffect(() => {
        const sequence = animation.current;
        if (!sequence) return;
        sequence.updatePlaybackRate(speed);
        if (paused) sequence.pause();
        else if (sequence.playState !== "finished") sequence.play();
    }, [sheet, loop, direction, paused, speed]);

    return (
        <span
            ref={element}
            aria-hidden="true"
            className={`spritesheet-effect ${className}`}
            style={{
                backgroundImage: `url("${sheet.src}")`,
                backgroundSize: `${sheet.columns * 100}% ${sheet.rows * 100}%`,
                ...style,
            }}
        />
    );
};
