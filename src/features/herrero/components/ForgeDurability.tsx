import { useId, useRef, useState } from "react";
import { InventoryTooltipPortal } from "../../inventory/components/InventoryTooltipPortal";
import "./forge-durability.css";

const cracks = [
    "M37 0 43 6 36 13 45 19 40 28 M36 13 27 16",
    "M139 0 132 7 139 13 130 21 134 28 M139 13 149 17",
    "M227 0 219 9 225 16 215 22 219 28 M219 9 209 12",
    "M78 0 72 8 81 16 74 22 79 28 M81 16 93 12",
    "M181 0 188 7 179 15 187 23 184 28 M179 15 166 20",
    "M13 0 19 8 10 17 17 28 M10 17 3 19",
    "M106 0 113 10 104 19 110 28 M113 10 122 8",
    "M256 0 247 8 254 17 245 28 M254 17 266 20",
];

export const ForgeDurability = ({ current, max }: { current: number; max: number }) => {
    const [showHelp, setShowHelp] = useState(false);
    const helpRef = useRef<HTMLButtonElement>(null);
    const tooltipId = useId();
    const state = Math.min(3, Math.max(0, Math.floor(current)));
    const visibleCracks = state === 3 ? [] : cracks.slice(0, state === 2 ? 3 : state === 1 ? 5 : 8);

    return (
        <section className="forge-durability" data-durability={state} aria-label="Durabilidad de forja">
            <div className="forge-durability__heading">
                <h3>Durabilidad</h3>
                <button
                    ref={helpRef}
                    type="button"
                    className="forge-durability__help"
                    aria-label="¿Qué es la durabilidad?"
                    aria-describedby={showHelp ? tooltipId : undefined}
                    onMouseEnter={() => setShowHelp(true)}
                    onMouseLeave={() => setShowHelp(false)}
                    onFocus={() => setShowHelp(true)}
                    onBlur={() => setShowHelp(false)}
                    onKeyDown={event => { if (event.key === "Escape") setShowHelp(false); }}
                >?</button>
            </div>
            <div className="forge-durability__bar" role="meter" aria-label="Durabilidad" aria-valuemin={0} aria-valuemax={max} aria-valuenow={current} aria-valuetext={`${current} de ${max}`}>
                <div className="forge-durability__metal" aria-hidden="true" />
                {state === 3 && <><span className="forge-durability__sweep" aria-hidden="true" /><span className="forge-durability__flare" aria-hidden="true" /></>}
                {visibleCracks.length > 0 && (
                    <svg className="forge-durability__cracks" viewBox="0 0 280 28" preserveAspectRatio="none" aria-hidden="true">
                        <g className="forge-durability__fractures">{visibleCracks.map(path => <path key={path} d={path} />)}</g>
                        {state === 0 && <g className="forge-durability__embers">{visibleCracks.map(path => <path key={path} d={path} />)}</g>}
                    </svg>
                )}
                <span className="forge-durability__number" aria-hidden="true">{current} / {max}</span>
            </div>
            {showHelp && (
                <InventoryTooltipPortal anchorRef={helpRef} id={tooltipId}>
                    <div className="w-[240px] max-w-full text-left text-xs leading-relaxed">
                        <h4 className="mb-2 text-center font-semibold text-amber-200">Durabilidad de forja</h4>
                        <p>Representa la resistencia del equipo ante los fallos de mejora. No modifica la probabilidad de éxito.</p>
                        <p className="mt-2">Si una mejora falla, el equipo puede perder durabilidad o destruirse. Cuanta menos durabilidad tenga, mayor será el riesgo de destrucción.</p>
                        <p className="mt-2">Con durabilidad 0, un fallo destruye el equipo salvo que utilices una protección que evite su destrucción.</p>
                    </div>
                </InventoryTooltipPortal>
            )}
        </section>
    );
};
