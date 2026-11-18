import { useLayoutEffect, useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import type { FightPlaybackState } from "../animations.types";
import type { SkillEffectMode } from "../skill-effects";
import { getSkillEffect } from "../skill-effects";
import { SpritesheetEffect } from "../../../../shared/animations/spritesheet/SpritesheetEffect";
import { getProjectileAngle, getProjectileKeyframes } from "../utils/skill-effect-geometry";

export interface SkillEffectLayerProps {
    effect: NonNullable<FightPlaybackState["skillEffect"]>;
    battlefieldRef: RefObject<HTMLElement | null>;
    paused?: boolean;
    speed?: number;
    mode?: SkillEffectMode;
}

/** Mount with key={effect.id} so repeated casts start a new sequence. */
export const SkillEffectLayer = ({
    effect,
    battlefieldRef,
    paused = false,
    speed = 1,
    mode,
}: SkillEffectLayerProps) => {
    const position = useRef<HTMLDivElement>(null);
    const direction = useRef<HTMLDivElement>(null);
    const motion = useRef<Animation | null>(null);
    const sheet = useMemo(() => getSkillEffect(effect.skillId, mode), [effect.skillId, mode]);

    useLayoutEffect(() => {
        const field = battlefieldRef.current;
        const node = position.current;
        const orientation = direction.current;
        if (!field || !node || !orientation || !sheet) return;

        const cards = Array.from(field.querySelectorAll<HTMLElement>("[data-fight-fighter-id]"));
        const source = cards.find(card => card.dataset.fightFighterId === effect.sourceFighterId);
        const target = cards.find(card => card.dataset.fightFighterId === effect.fighterId);
        if (!source || !target) return;

        const updateGeometry = () => {
            const fieldRect = field.getBoundingClientRect();
            const sourceRect = source.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const start = {
                x: sourceRect.left + sourceRect.width / 2 - fieldRect.left,
                y: sourceRect.top + sourceRect.height / 2 - fieldRect.top,
            };
            const end = {
                x: targetRect.left + targetRect.width / 2 - fieldRect.left,
                y: targetRect.top + targetRect.height / 2 - fieldRect.top,
            };

            if (sheet.mode === "target") {
                orientation.style.transform = "none";
                node.style.transform = `translate(${end.x}px, ${targetRect.bottom - fieldRect.top - 8}px)`;
                return;
            }

            const angle = getProjectileAngle(start, end);
            const verticalScale = Math.abs(angle) > 90 ? -1 : 1;
            orientation.style.transform = `rotate(${angle}deg) scaleY(${verticalScale})`;
            const keyframes = getProjectileKeyframes(start, end, sheet.launchFraction);
            if (motion.current) {
                // Keep the current time when cards resize or the page scrolls.
                (motion.current.effect as KeyframeEffect).setKeyframes(keyframes);
            } else {
                motion.current = node.animate(keyframes, {
                    duration: sheet.frameCount / sheet.fps * 1000,
                    fill: "forwards",
                    easing: "linear",
                });
            }
        };

        updateGeometry();
        const observer = new ResizeObserver(updateGeometry);
        observer.observe(field);
        cards.forEach(card => observer.observe(card));
        window.addEventListener("resize", updateGeometry);
        window.addEventListener("scroll", updateGeometry, true);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateGeometry);
            window.removeEventListener("scroll", updateGeometry, true);
            motion.current?.cancel();
            motion.current = null;
        };
    }, [battlefieldRef, effect.fighterId, effect.sourceFighterId, sheet]);

    useEffect(() => {
        const animation = motion.current;
        if (!animation) return;
        animation.updatePlaybackRate(speed);
        if (paused) animation.pause();
        else if (animation.playState !== "finished") animation.play();
    }, [paused, speed, sheet]);

    if (!sheet) return null;

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-40">
            <div ref={position} className="absolute left-0 top-0 h-0 w-0">
                <div ref={direction} className="h-0 w-0">
                    <div
                        style={{
                            width: sheet.width,
                            height: sheet.height,
                            transform: `translate(${-sheet.anchorX * 100}%, ${-sheet.anchorY * 100}%)`,
                        }}
                    >
                        <SpritesheetEffect sheet={sheet} speed={speed} paused={paused} />
                    </div>
                </div>
            </div>
        </div>
    );
};
