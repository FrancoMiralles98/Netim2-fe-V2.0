import type { CSSProperties } from "react";
import type { LetterMasteryLv } from "netim2-shared";
import "./skill-mastery-aura.css";

interface SkillMasteryIconProps {
    src: string;
    alt: string;
    mastery: LetterMasteryLv;
}

const OUTLINE = "M10 3.5H36L42.5 10V36L36 42.5H10L3.5 36V10Z";
const SPARKS = [
    { x: 21, y: -17, dx: 7, dy: -6, delay: 0 },
    { x: -23, y: 19, dx: -6, dy: 4, delay: 0.35 },
    { x: -21, y: -8, dx: -9, dy: -5, delay: -0.42 },
    { x: 21, y: 3, dx: 10, dy: -2, delay: -0.87 },
    { x: -20, y: 9, dx: -8, dy: 5, delay: -1.34 },
    { x: 23, y: 18, dx: 8, dy: 6, delay: -1.81 },
];

export const SkillMasteryIcon = ({ src, alt, mastery }: SkillMasteryIconProps) => (
    <span className="skill-mastery-icon">
        {mastery !== "N" && (
            <span className="skill-mastery-icon__effect" data-mastery={mastery} aria-hidden="true">
                <span className="skill-mastery-icon__halo" />
                <svg className="skill-mastery-icon__outline" viewBox="0 0 46 46" focusable="false">
                    <path className="skill-mastery-icon__rim" d={OUTLINE} />
                    <path className="skill-mastery-icon__core" d={OUTLINE} />
                    {mastery !== "M" && (
                        <path className="skill-mastery-icon__sweep" pathLength={100} d={OUTLINE} />
                    )}
                </svg>
                {mastery === "P" && SPARKS.map(({ x, y, dx, dy, delay }) => (
                    <span
                        key={delay}
                        className="skill-mastery-icon__spark"
                        style={{
                            "--spark-x": `${x}px`,
                            "--spark-y": `${y}px`,
                            "--spark-dx": `${dx}px`,
                            "--spark-dy": `${dy}px`,
                            "--spark-delay": `${delay}s`,
                        } as CSSProperties}
                    />
                ))}
            </span>
        )}
        <img className="skill-mastery-icon__image" src={src} alt={alt} width={32} height={32} />
    </span>
);
