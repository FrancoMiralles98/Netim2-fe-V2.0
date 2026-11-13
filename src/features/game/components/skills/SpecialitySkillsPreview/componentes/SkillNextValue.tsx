import type { SkillType } from "netim2-shared";
import { useSkillUpgrade } from "../skill-upgrade-preview.context";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export const NextValue = ({ current, next }: { current: string | number | null | undefined; next: string | number | null | undefined }) => {
    if (next === undefined || next === null || next === current) return null;
    const formatted = typeof next === "number" ? numberFormat.format(next) : next;
    return <span className="ml-2 inline-flex items-baseline gap-1 text-sm font-normal text-green-400" aria-label={`Siguiente nivel: ${formatted}`}><span aria-hidden="true">→</span> {formatted}</span>;
};

/** Selects already calculated runtime values; never evaluates skill scaling on the client. */
export const SkillNextValue = ({ select }: { select: (skill: SkillType) => string | number | null | undefined }) => {
    const data = useSkillUpgrade()?.data;
    return data?.next ? <NextValue current={select(data.current)} next={select(data.next)} /> : null;
};
