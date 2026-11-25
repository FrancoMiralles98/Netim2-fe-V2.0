const numberFormatter = new Intl.NumberFormat("es-AR");

export const formatCompactReward = (amount: number): string => {
    const magnitude = Math.abs(amount);
    if (magnitude >= 1_000_000) return `${(Math.trunc(amount / 10_000) / 100).toFixed(2)}kk`;
    if (magnitude >= 10_000) return `${Math.trunc(amount / 1_000)}k`;
    if (magnitude >= 1_000) return `${Math.trunc(amount / 100) / 10}k`;
    return numberFormatter.format(amount);
};
