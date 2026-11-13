import { useEffect, useRef, type CSSProperties } from "react";
import { paintStillVortex, subscribeVortex, VORTEX_SIZE } from "./vortex-renderer";
import "./portal-vortex.css";

interface PortalVortexProps {
    className?: string;
    style?: CSSProperties;
    paused?: boolean;
}

export const PortalVortex = ({ className = "", style, paused = false }: PortalVortexProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let visible = false;
        let unsubscribe: (() => void) | undefined;

        const update = () => {
            const shouldAnimate = visible && !document.hidden && !paused && !reducedMotion.matches;
            if (shouldAnimate) {
                unsubscribe ??= subscribeVortex(context);
            } else {
                unsubscribe?.();
                unsubscribe = undefined;
                if (visible && !document.hidden) paintStillVortex(context);
            }
        };

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            update();
        });
        observer.observe(canvas);
        reducedMotion.addEventListener("change", update);
        document.addEventListener("visibilitychange", update);

        return () => {
            observer.disconnect();
            reducedMotion.removeEventListener("change", update);
            document.removeEventListener("visibilitychange", update);
            unsubscribe?.();
        };
    }, [paused]);

    return (
        <canvas
            ref={canvasRef}
            className={`portal-vortex ${className}`}
            width={VORTEX_SIZE}
            height={VORTEX_SIZE}
            style={style}
            aria-hidden="true"
        />
    );
};
