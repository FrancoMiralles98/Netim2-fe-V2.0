import type { PartialHistorialDetalle } from "netim2-shared";

export const getHistoryOutcome = (result: PartialHistorialDetalle["result"]) => {
    if (result.outcome === "draw") return { label: "Empate", tone: "draw" };
    return result.winnerSide === "allies"
        ? { label: "Victoria", tone: "victory" }
        : { label: "Derrota", tone: "defeat" };
};
