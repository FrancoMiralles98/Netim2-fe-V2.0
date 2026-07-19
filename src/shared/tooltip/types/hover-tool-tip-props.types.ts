import type { ReactNode } from "react";

export interface HoverTooltipProps {
  title?: string;
  message?: string;
  children: ReactNode;
  content?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?:number
}

export interface TooltipCoords {
  top: number;
  left: number;
  transform: string;
}