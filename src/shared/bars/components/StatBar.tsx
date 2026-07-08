import { useEffect, useState } from "react";
import { STAT_COLORS } from "../../colors/stats-colors";
import type { StatBarProps } from "../types/stat-bar.types";

export const StatBar = ({ name, value, maxValue = 200, isActive = true }: StatBarProps) => {
    const colors = STAT_COLORS[name];

    const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setAnimatedPercentage(0);
            return;
        }

        setAnimatedPercentage(0);

        const timeoutId = setTimeout(() => {
            setAnimatedPercentage(percentage);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [isActive, percentage]);

    return (
        <div className="w-full mt-1">
            <div className="mb-1 flex items-center justify-between">
                <p className={`text-xs font-bold ${colors.text}`}>
                    {name}
                </p>

                <p className="text-xs text-yellow-100">
                    {value}/{maxValue}
                </p>
            </div>

            <div className={`h-2 w-full overflow-hidden  ${colors.bg}`}>
                <div
                    className={`h-full  ${colors.fill} transition-all duration-700 ease-out`}
                    style={{ width: `${animatedPercentage}%` }}
                />
            </div>
        </div>
    );
};