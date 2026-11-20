export const formatExperienceReward = (amount: number, expNextLv: number): string => {
    if (expNextLv <= 0) return "—";

    const percentage = (amount / expNextLv) * 100;
    if (percentage > 100) return ">100%";
    if (percentage < 0.1) return "<0.1%";
    return `${Number(percentage.toFixed(1))}%`;
};
