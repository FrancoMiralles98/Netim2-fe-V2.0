import type { LetterMasteryLv } from "netim2-shared";
import { SKILL_MASTERY_COLORS } from "../../../../../../shared/colors/skill-mastery-colors";
import { MASTERY_LEVELS } from "../../utils/skill-preview-formatters";

export const SkillMasteryProgression = ({ mastery }: { mastery: LetterMasteryLv }) => (
    <div className="mt-4 grid grid-cols-4 gap-2">
        {MASTERY_LEVELS.map((rank) => (
            <span
                key={rank}
                aria-current={mastery === rank ? "step" : undefined}
                className={`border-b-2 pb-2 text-center text-sm ${SKILL_MASTERY_COLORS[rank]} ${mastery === rank ? "font-bold opacity-100" : "opacity-50"}`}
            >
                {rank}
            </span>
        ))}
    </div>
);
