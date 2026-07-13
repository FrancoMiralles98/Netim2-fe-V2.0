import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { HoverTooltipProps, TooltipCoords } from "../types/hover-tool-tip-props.types";
import { createPortal } from "react-dom";

export const HoverTooltip = ({
  title,
  message,
  children,
  content,
  position = 'top',
  width = 260,
}: HoverTooltipProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;
    let transform = '';

    if (position === 'top') {
      top = rect.top - offset;
      left = rect.left + rect.width / 2;
      transform = 'translate(-50%, -100%)';
    }

    if (position === 'bottom') {
      top = rect.bottom + offset;
      left = rect.left + rect.width / 2;
      transform = 'translateX(-50%)';
    }

    if (position === 'left') {
      top = rect.top + rect.height / 2;
      left = rect.left - offset;
      transform = 'translate(-100%, -50%)';
    }

    if (position === 'right') {
      top = rect.top + rect.height / 2;
      left = rect.right + offset;
      transform = 'translateY(-50%)';
    }

    const margin = 12;
    const halfWidth = width / 2;

    if (position === 'top' || position === 'bottom') {
      left = Math.max(halfWidth + margin, left);
      left = Math.min(window.innerWidth - halfWidth - margin, left);
    }

    setCoords({ top, left, transform });
  }, [position, width]);

  const openTooltip = () => {
    updatePosition();
    setIsOpen(true);
  };

  const closeTooltip = () => {
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isOpen &&
        coords &&
        createPortal(
          <div
            className="
              pointer-events-none fixed z-[99999]
              rounded border border-yellow-700
              bg-black/95 p-3 text-xs text-neutral-200
              shadow-[0_0_18px_rgba(0,0,0,0.9)]
            "
            style={{
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
              width,
            }}
          >
            {title && (
              <h3 className="mb-2 text-sm font-bold text-yellow-500">
                {title}
              </h3>
            )}

            {message && (
              <p className="mb-0 leading-relaxed">
                {message}
              </p>
            )}

            {content}
          </div>,
          document.body,
        )}
    </>
  );
};