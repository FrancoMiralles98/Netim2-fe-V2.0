export const resolveCriticalDamageMultiplier = (...values: unknown[]): number | null => (
    values.find((value): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0) ?? null
);
