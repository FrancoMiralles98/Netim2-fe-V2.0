import type { SkillType } from "netim2-shared";
import { SkillMasteryProgression } from "./SkillMasteryProgression";
import { SkillUpgradeProgress } from "./SkillUpgradeProgress";

const MASTERY_LABELS = {
    N: "Novato",
    M: "Maestro",
    G: "Gran Maestro",
    P: "Perfecto",
} satisfies Record<SkillType["mastery"], string>;

export const SkillProgressionPanel = ({ mastery, lv }: Pick<SkillType, "mastery" | "lv">) => (
    <aside className={`self-start bg-[#1a1c1e]/95 bg-[image:var(--skill-panel-frame)] bg-[length:100%_100%] bg-no-repeat ${mastery === "G" ? "px-9 py-10" : "p-7"}`}>
        <p className="text-xs tracking-widest text-sky-200">PROGRESIÓN</p>
        <h3 className="mt-1 font-metin text-lg text-amber-100">{MASTERY_LABELS[mastery]} · Nivel {lv}</h3>
        <SkillMasteryProgression mastery={mastery} />
        <SkillUpgradeProgress />
    </aside>
);
