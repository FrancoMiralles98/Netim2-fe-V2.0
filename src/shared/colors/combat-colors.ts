import type { DamageType, StatusEffectsKeys } from "netim2-shared";

// Tonos de combate compartidos por animaciones, resultados y detalles de habilidades.
export const COMBAT_COLORS = {
    ad: { text: "text-orange-300", bg: "bg-orange-500", border: "border-orange-300" },
    ap: { text: "text-blue-300", bg: "bg-blue-500", border: "border-blue-300" },
    true: { text: "text-slate-100", bg: "bg-slate-100", border: "border-slate-100" },
    sangrado: { text: "text-red-500", bg: "bg-red-500", border: "border-red-500" },
    electrico: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400" },
    veneno: { text: "text-green-500", bg: "bg-green-500", border: "border-green-500" },
    incendio: { text: "text-orange-500", bg: "bg-orange-500", border: "border-orange-500" },
} as const satisfies Record<DamageType | Exclude<StatusEffectsKeys, "desmayo" | "retardo">, { text: string; bg: string; border: string }>;
