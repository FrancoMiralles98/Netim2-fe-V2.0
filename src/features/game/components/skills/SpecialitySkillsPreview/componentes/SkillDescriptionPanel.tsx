import type { ReactNode } from "react";
import type { LetterMasteryLv } from "netim2-shared";

export const SkillDescriptionPanel = ({ children, mastery }: { children: ReactNode; mastery: LetterMasteryLv }) => {
    const hasOrnateFrame = mastery === "G" || mastery === "P";

    return (
        <article className={`flex min-h-0 flex-col bg-[#1a1c1e]/95 bg-[image:var(--skill-panel-frame)] bg-[length:100%_100%] bg-no-repeat ${hasOrnateFrame ? "relative" : "py-7 pr-3 pl-7"}`}>
            <div
                role="region"
                aria-label="Descripción de la habilidad"
                tabIndex={0}
                className={`min-h-0 overflow-y-auto pr-3 [scrollbar-color:#8b806f_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] focus-visible:outline-1 focus-visible:outline-amber-200/60 ${hasOrnateFrame ? "absolute inset-x-[7%] inset-y-[12%]" : "flex-1"}`}
            >
                {children}
            </div>
        </article>
    );
};
