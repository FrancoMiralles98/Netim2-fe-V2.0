import { drawCharge, ease, glow, clamp } from "./upgrade-visuals";
import { drawSuccessEnding, getSuccessFrame } from "./success-ending";
import { renderFailureEnding } from "./failure-ending";
import { drawModerateCore } from "../item-moderate-upgrade/moderate-charge";
import { drawModerateSuccessEnding, getModerateSuccessFrame } from "../item-moderate-upgrade/moderate-success-ending";
import { drawHighCharge, getHighPreparationFrame } from "../item-high-upgrade/high-charge";
import { drawHighSuccessEnding, getHighSuccessFrame } from "../item-high-upgrade/high-success-ending";
import { createProtectedFailureSparks, type ProtectedFailureSpark } from "../item-upgrade-protected-failure/protected-failure-particles";
import { drawProtectedFailureEnding, getProtectedFailureFrame, renderProtectedFailureTint } from "../item-upgrade-protected-failure/protected-failure-ending";

export type ItemLowLevelUpgradeResult = "pending" | "success" | "failure" | "protected-failure";
type FinalResult = Exclude<ItemLowLevelUpgradeResult, "pending">;

export interface LowLevelUpgradeAnimation {
    setPaused: (paused: boolean) => void;
    setResult: (result: ItemLowLevelUpgradeResult) => void;
    dispose: () => void;
}

interface UpgradeElements {
    tier: "low" | "moderate" | "high";
    skipPreparation?: boolean;
    root: HTMLElement;
    moving: HTMLElement;
    intact: HTMLElement;
    image: HTMLImageElement;
    silhouette: HTMLElement;
    cuts: HTMLElement;
    fragments: HTMLElement;
    canvas: HTMLCanvasElement;
    backdrop?: HTMLCanvasElement;
    preparationDuration: number;
    endingDuration?: number;
    liftDistance: number;
    onComplete: () => void;
}

export const createLowLevelUpgradeAnimation = ({
    root, moving, intact, image, silhouette, cuts, fragments, canvas, backdrop,
    preparationDuration, endingDuration, liftDistance, onComplete, tier, skipPreparation = false,
}: UpgradeElements): LowLevelUpgradeAnimation => {
    const context = canvas.getContext("2d");
    const backContext = backdrop?.getContext("2d");
    const high = tier === "high";
    const prepareMs = Number.isFinite(preparationDuration) && preparationDuration > 0 ? preparationDuration : high ? 3600 : 2300;
    const lift = Number.isFinite(liftDistance) && liftDistance >= 0 ? liftDistance : high ? 36 : 32;
    const cutNodes = Array.from(cuts.children) as HTMLElement[];
    const pieces = Array.from(fragments.children) as HTMLElement[];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const moderate = tier === "moderate";
    let paused = true, ready = image.complete && image.naturalWidth > 0;
    let finished = false, disposed = false;
    let result: ItemLowLevelUpgradeResult = "pending";
    let ending: FinalResult | undefined;
    let frame: number | undefined, previousTime: number | undefined;
    let elapsed = skipPreparation ? prepareMs : 0, endingElapsed = 0, waitingElapsed = 0;
    let protectedSparks: ProtectedFailureSpark[] = [];
    let width = 0, height = 0, padding = 0, scale = 1;
    let itemWidth = 0, itemHeight = 0;

    const endingMs = () => typeof endingDuration === "number" && Number.isFinite(endingDuration) && endingDuration > 0
        ? endingDuration : ending === "protected-failure" ? 4300 : ending === "failure" ? 1850 : high ? 2200 : moderate ? 2100 : 1250;
    const clearCanvas = () => {
        context?.clearRect(0, 0, width + padding * 2, height + padding * 2);
        backContext?.clearRect(0, 0, width + padding * 2, height + padding * 2);
    };
    const reset = () => {
        moving.style.transform = "";
        moving.style.opacity = "1";
        moving.removeAttribute("aria-hidden");
        intact.style.opacity = "1";
        silhouette.style.opacity = "0";
        silhouette.style.backgroundColor = "";
        silhouette.style.filter = "";
        cuts.style.opacity = "0";
        fragments.style.opacity = "0";
        clearCanvas();
    };
    const settle = () => {
        reset();
        root.dataset.phase = "complete";
        if (ending === "failure") {
            moving.style.opacity = "0";
            moving.setAttribute("aria-hidden", "true");
        }
    };
    const render = () => {
        if (finished) { settle(); return; }
        if (motion.matches) { reset(); root.dataset.phase = "waiting"; return; }
        clearCanvas();
        const preparing = elapsed < prepareMs;
        const progress = clamp(endingElapsed / endingMs());
        const preparationProgress = clamp(elapsed / prepareMs);
        const highTime = preparationProgress * 3.6 + waitingElapsed / 1000;
        const highPreparation = high ? getHighPreparationFrame(preparationProgress, highTime, lift) : undefined;
        const success = ending === "success"
            ? (high ? getHighSuccessFrame : moderate ? getModerateSuccessFrame : getSuccessFrame)(progress, lift) : undefined;
        const protectedFrame = ending === "protected-failure" ? getProtectedFailureFrame(progress, lift) : undefined;
        const time = success?.time ?? Math.min(2.3, elapsed / prepareMs * 2.3);
        const offset = protectedFrame?.offset ?? success?.offset ?? highPreparation?.offset ?? lift * ease((time - 0.18) / 0.65);
        const charge = protectedFrame?.charge ?? success?.charge ?? highPreparation?.charge ?? ease((time - 0.6) / 1.55);
        moving.style.transform = highPreparation && !ending
            ? `translate(${highPreparation.dx * scale}px, ${-offset + highPreparation.dy * scale}px) rotate(${highPreparation.rotation}rad)`
            : `translateY(${-offset}px)`;
        silhouette.style.opacity = String(charge);
        if (moderate) {
            silhouette.style.backgroundColor = "#fff6df";
            silhouette.style.filter = "drop-shadow(0 0 8px #ffe6ab)";
        }
        if (high) {
            silhouette.style.backgroundColor = "#fff5dc";
            silhouette.style.filter = "drop-shadow(0 0 10px #ffe4a6)";
        }
        root.dataset.phase = preparing ? "charging" : ending ?? "waiting";
        const x = padding + width / 2, y = padding + height / 2 - offset;
        if (context && !high) {
            if (preparing || ending === "success") drawCharge(context, time, x, y, scale, moderate);
            else if (!ending) glow(context, x, y, 76 * scale, 0.16, moderate ? "255,235,184" : "255,255,255");
            if (moderate && !ending) drawModerateCore(context, elapsed / prepareMs, time + waitingElapsed / 1000, x, y, scale);
        }
        if (high && !ending) {
            if (backContext) drawHighCharge(backContext, highTime, preparationProgress, x, y, scale, false);
            else if (context) drawHighCharge(context, highTime, preparationProgress, x, y, scale, false);
            if (context) drawHighCharge(context, highTime, preparationProgress, x, y, scale, true);
        }
        if (success && context) {
            if (high) drawHighSuccessEnding(context, progress, x, padding + height / 2 - lift, scale);
            else if (moderate) drawModerateSuccessEnding(context, progress, x, padding + height / 2 - lift, scale);
            else drawSuccessEnding(context, success.time, x, y, scale);
        }
        if (ending === "failure") {
            cuts.style.opacity = "1";
            renderFailureEnding({ progress, silhouette, intact, cuts: cutNodes, fragments, pieces, scale });
        }
        if (protectedFrame) {
            renderProtectedFailureTint(silhouette, protectedFrame);
            if (context) drawProtectedFailureEnding(context, {
                time: protectedFrame.time, x, restingY: padding + height / 2, lift,
                itemWidth, itemHeight, scale, sparks: protectedSparks,
            });
        }
    };

    const measure = () => {
        const bounds = root.getBoundingClientRect();
        width = bounds.width; height = bounds.height;
        const fit = image.naturalWidth > 0 ? Math.min(width / image.naturalWidth, height / image.naturalHeight) : 0;
        itemHeight = fit ? fit * image.naturalHeight : height;
        itemWidth = fit ? fit * image.naturalWidth : width;
        scale = itemHeight / 192;
        padding = Math.ceil(Math.max((high || ending === "protected-failure" ? 200 : moderate ? 150 : 120) * scale, lift + 80 * scale));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        for (const layer of [canvas, backdrop]) {
            if (!layer) continue;
            layer.width = Math.ceil((width + padding * 2) * dpr);
            layer.height = Math.ceil((height + padding * 2) * dpr);
            Object.assign(layer.style, {
                width: `${width + padding * 2}px`, height: `${height + padding * 2}px`,
                left: `${-padding}px`, top: `${-padding}px`,
            });
        }
        context?.setTransform(dpr, 0, 0, dpr, 0, 0);
        backContext?.setTransform(dpr, 0, 0, dpr, 0, 0);
        render();
    };
    const stop = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        frame = undefined; previousTime = undefined;
    };
    const tick = (now: number) => {
        frame = undefined;
        if (disposed || finished || paused || !ready || document.hidden) return;
        const delta = previousTime === undefined ? 0 : Math.max(0, now - previousTime);
        previousTime = now;
        const previousElapsed = elapsed;
        if ((moderate || high) && !ending && elapsed >= prepareMs && result === "pending") waitingElapsed += delta;
        if (motion.matches) elapsed = prepareMs;
        else if (ending) endingElapsed = Math.min(endingMs(), endingElapsed + delta);
        else elapsed = Math.min(prepareMs, elapsed + delta);
        if (!ending && elapsed >= prepareMs && result !== "pending") {
            ending = result;
            // Carry overshoot into the ending so the original success timing is unchanged.
            endingElapsed = motion.matches ? endingMs() : Math.max(0, previousElapsed + delta - prepareMs);
            if (ending === "protected-failure") {
                if (!motion.matches) protectedSparks = createProtectedFailureSparks(image);
                measure();
            }
        }
        if (ending && (motion.matches || endingElapsed >= endingMs())) {
            finished = true;
            settle();
            onComplete();
            return;
        }
        render();
        if (elapsed < prepareMs || ending || ((moderate || high) && !motion.matches)) frame = requestAnimationFrame(tick);
        else previousTime = undefined;
    };
    const update = () => {
        stop();
        if (!disposed && !finished && !paused && ready && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const loaded = () => { ready = image.naturalWidth > 0; measure(); update(); };
    const failed = () => { ready = false; stop(); reset(); root.dataset.phase = "error"; };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    image.addEventListener("load", loaded);
    image.addEventListener("error", failed);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    measure();

    return {
        setPaused(value) { if (paused !== value) { paused = value; update(); } },
        setResult(value) {
            if (finished || ending || result === value) return;
            result = value;
            update();
        },
        dispose() {
            disposed = true; stop(); observer.disconnect();
            image.removeEventListener("load", loaded);
            image.removeEventListener("error", failed);
            motion.removeEventListener("change", update);
            document.removeEventListener("visibilitychange", update);
            reset(); delete root.dataset.phase;
        },
    };
};
