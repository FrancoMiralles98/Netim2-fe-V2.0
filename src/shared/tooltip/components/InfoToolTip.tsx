import { useState } from "react";
import type { InfoTooltipProps } from "../types/info-tool-tip-props.types";
import { NetimText } from "../../typography/components/NetimText";

export const InfoTooltip = ({
  title,
  message,
  position = 'bottom',
  size = 'normal'
}: InfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClass = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
    left: 'right-full top-1/2 mr-2 -translate-y-1/2',
    right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  };

  const sizeClass = {
    normal: 'h-5 w-5 text-[12px]',
    small: 'h-4 w-4 text-[10px]',
  };

  return (
    <div className="relative re inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center justify-center
          rounded-full border border-yellow-500
          bg-black/80 font-bold text-yellow-400
          shadow-[0_0_8px_rgba(234,179,8,0.6)]
          transition-all duration-200
          hover:scale-110 hover:bg-yellow-500 hover:text-black
          ${sizeClass[size]}
        `}
      >
        ?
      </button>

      {isOpen && (
        <div
          className={`
            absolute z-[9999] w-[300px]
            rounded border border-yellow-700
            bg-black/85 p-3 text-sm text-yellow-100
            shadow-[0_0_15px_rgba(0,0,0,0.9)]
            ${positionClass[position]}
          `}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-yellow-500">
              {title}
            </h3>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-neutral-400 hover:text-red-400"
            >
              ✕
            </button>
          </div>

          {message && (
            <NetimText text={message} cssAditionals="text-start" />
          )}

        </div>
      )}
    </div>
  );
};