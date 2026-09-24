import { MiniTooltip } from "../../../shared/tooltip/components/MiniTooltip";

interface ExperienceIndicatorProps {
    exp: number;
    expNextLv: number;
}

const EXP_FRAMES = [
    { below: 5, x: 0, y: 0 },
    { below: 10, x: 102, y: 0 },
    { below: 16, x: 207, y: 0 },
    { below: 25, x: 312, y: 0 },
    { below: 30, x: 415, y: 0 },
    { below: 36, x: 520, y: 0 },
    { below: 41, x: 625, y: 1 },
    { below: 50, x: 730, y: 0 },
    { below: 56, x: 835, y: 0 },
    { below: 61, x: 940, y: 0 },
    { below: 66, x: 1044, y: 0 },
    { below: 75, x: 1148, y: 0 },
    { below: 81, x: 1255, y: 0 },
    { below: 86, x: 1357, y: 0 },
    { below: 91, x: 1461, y: 1 },
    { below: 96, x: 1566, y: 1 },
    { below: Infinity, x: 1670, y: 1 },
] as const;

export const ExperienceIndicator = ({ exp, expNextLv }: ExperienceIndicatorProps) => {
    const percentage = expNextLv > 0
        ? Math.min(100, Math.max(0, (exp / expNextLv) * 100))
        : 0;
    const frame = EXP_FRAMES.find(item => percentage < item.below)
        ?? EXP_FRAMES[EXP_FRAMES.length - 1];

    return (
        <div id="exp" className="flex items-center">
            <MiniTooltip text={`Experiencia: ${Math.floor(percentage)}%`}>
                <div
                    className="h-[27px] w-[100px] overflow-hidden bg-[url('/game/exp.png')] bg-no-repeat"
                    style={{ backgroundPosition: `-${frame.x}px ${frame.y}px` }}
                    role="img"
                    aria-label={`Experiencia: ${Math.floor(percentage)}%`}
                />
            </MiniTooltip>
        </div>
    );
};
