import type { SkillAura } from "netim2-shared";
import { SkillResourceCosts } from "../SkillResourceCosts";

export const AuraGeneralSection = ({ skill }: { skill: SkillAura }) => (
    <section className="space-y-3 text-sm">
        <h4 className="font-metin text-base text-amber-300">General</h4>
        <SkillResourceCosts skill={skill} showDuration />
    </section>
);
