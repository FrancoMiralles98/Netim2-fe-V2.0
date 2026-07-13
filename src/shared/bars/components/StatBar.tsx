import { STAT_COLORS } from "../../colors/stats-colors";
import type { StatBarProps } from "../types/stat-bar.types";

export const StatBar = ({name,value,maxValue = 200,isActive = true,animationKey,}: StatBarProps) => {
  const colors = STAT_COLORS[name];

  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

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

      <div className={`h-2 w-full overflow-hidden ${colors.bg}`}>
        <div
          key={`${animationKey ?? ''}-${name}-${value}-${isActive}`}
          className={`
            h-full origin-left ${colors.fill}
            ${
              isActive
                ? 'animate-[statBarFill_700ms_ease-out_forwards]'
                : 'scale-x-0'
            }
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};