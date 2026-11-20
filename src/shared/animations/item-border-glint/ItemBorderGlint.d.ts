import type { CSSProperties, ReactElement } from "react";

export interface ItemBorderGlintProps {
    className?: string;
    style?: CSSProperties;
    paused?: boolean;
    variant?: "gold" | "blue" | "red";
    /** Duration of one lap in seconds. */
    duration?: number;
    /** Radius of the slot corners in pixels. */
    radius?: number;
}

export function ItemBorderGlint(props: ItemBorderGlintProps): ReactElement;
