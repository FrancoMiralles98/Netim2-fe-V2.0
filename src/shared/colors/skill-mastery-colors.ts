import type { LetterMasteryLv } from "netim2-shared";

export const SKILL_MASTERY_COLORS = {
    N: "border-gray-100 text-gray-100",
    M: "border-orange-300 text-orange-300",
    G: "border-red-300 text-red-300",
    P: "border-red-600 text-red-600",
} as const satisfies Record<LetterMasteryLv, string>;
