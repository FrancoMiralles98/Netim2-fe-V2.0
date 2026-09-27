import { STAT_COLORS } from "../../colors/stats-colors";
import type { StatBarProps } from "../types/stat-bar.types";

export const StatBar = ({ name, value, maxValue = 200, isActive = true, animationKey, }: StatBarProps) => {
  const colors = STAT_COLORS[name];

  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  return (
    <div className=" flex w-full items-center gap-2 my-1">
      <div className="shrink-0">
        <p className={`text-xs text-center w-[2rem] p-1 border-b border-b-gray-300 border-r border-r-gray-300 bg-black font-bold ${colors.text}`}>
          {name}
        </p>
      </div>
      <div className="flex h-2 min-w-0 flex-1 items-center">
        <img src="/utils/barra-left.png" alt="" className="h-[7px] w-[11px] shrink-0" />
        <div className="h-full min-w-0 flex-1 overflow-hidden bg-[url('/utils/barra-vacia.png')] bg-repeat-x">
          <div
            key={`${animationKey ?? ''}-${name}-${value}-${isActive}`}
            className={`
              h-full origin-left bg-repeat-x
              ${isActive
                ? 'animate-[statBarFill_700ms_ease-out_forwards]'
                : 'scale-x-0'
              }
            `}
            style={{
              width: `${percentage}%`,
              backgroundImage: `url('/utils/barra-${name.toLowerCase()}.png')`
            }}
          />
        </div>
        <img src="/utils/barra-right.png" alt="" className="h-[7px] w-[11px] shrink-0" />
      </div>
      <p className="w-[50px] shrink-0 border-b border-b-gray-300 border-r border-r-gray-300 bg-black p-1 text-right text-xs text-white">
        {value}/{maxValue}
      </p>
    </div>
  );
};
