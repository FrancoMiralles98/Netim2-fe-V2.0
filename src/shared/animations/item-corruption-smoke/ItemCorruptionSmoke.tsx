import { useEffect, useRef, type CSSProperties } from "react";
import { showStillSmoke, subscribeSmoke } from "./smoke-renderer";
import "./item-corruption-smoke.css";

interface ItemCorruptionSmokeProps {
    className?: string;
    style?: CSSProperties;
    paused?: boolean;
}

/** Persistent red smoke, rendered behind the item image. */
export const ItemCorruptionSmoke = ({ className = "", style, paused = false }: ItemCorruptionSmokeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let visible = false;
        let unsubscribe: (() => void) | undefined;
        const update = () => {
            unsubscribe?.();
            unsubscribe = undefined;
            if (!visible || document.hidden) return;
            if (paused || motion.matches) showStillSmoke(context);
            else unsubscribe = subscribeSmoke(context);
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            update();
        });
        observer.observe(canvas);
        motion.addEventListener("change", update);
        document.addEventListener("visibilitychange", update);
        return () => {
            observer.disconnect();
            motion.removeEventListener("change", update);
            document.removeEventListener("visibilitychange", update);
            unsubscribe?.();
        };
    }, [paused]);

    return (
        <span className={`item-corruption-smoke ${className}`} style={style} aria-hidden="true">
            <canvas ref={canvasRef} width={128} height={184} />
        </span>
    );
};
