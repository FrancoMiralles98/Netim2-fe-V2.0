import { useState } from "react";
import type { SkillAura } from "netim2-shared";
import { getSkillIconPath } from "../../../../../../../shared/utils/get-skill-icon-path";
import { MASTERY_LEVELS } from "../../../utils/skill-preview-formatters";
import { AuraGeneralSection } from "./AuraGeneralSection";
import { AuraEffectSection } from "./AuraEffectSection";

const TABS = [{ id: "general", label: "General" }, { id: "effect", label: "Efecto" }] as const;

export const AuraSkillDetails = ({ skill }: { skill: SkillAura }) => {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]["id"]>("general");

    return (
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-[1.45fr_1fr] gap-4">
            <article className="min-h-0 overflow-y-auto border border-slate-500/45 bg-[#1a1c1e]/95 p-5">
                <div className="mb-3 flex justify-end">
                    <span className="rounded-full border border-cyan-400 bg-transparent px-3 py-1 text-xs font-semibold text-slate-200">Aura</span>
                </div>
                <div className="flex items-center gap-4">
                    <img src={getSkillIconPath(skill.id, skill.mastery)} alt="" className="h-14 w-14 object-contain" />
                    <div>
                        <p className="text-xs tracking-widest text-sky-200">{skill.mastery === "N" ? "NORMAL" : skill.mastery} · NIVEL {skill.lv}</p>
                        <h3 className="font-metin text-[26px] text-amber-300">{skill.nombre}</h3>
                    </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">{skill.description}</p>
                <div role="tablist" aria-label="Detalles del aura" className="mt-5 flex flex-wrap gap-1 border-b border-slate-500/40">
                    {TABS.map((tab) => (
                        <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer border-b-2 px-3 py-2 text-xs transition-colors hover:text-amber-200 ${activeTab === tab.id ? "border-amber-400 text-amber-300" : "border-transparent text-slate-300"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div role="tabpanel" className="min-h-24 pt-4">
                    {activeTab === "general" ? <AuraGeneralSection skill={skill} /> : <AuraEffectSection skill={skill} />}
                </div>
            </article>
            <aside className="self-start border border-slate-500/45 bg-[#1a1c1e]/95 p-5">
                <p className="text-xs tracking-widest text-sky-200">PROGRESIÓN</p>
                <h3 className="mt-1 font-metin text-lg text-amber-100">{skill.mastery === "N" ? "Normal" : skill.mastery} · Nivel {skill.lv}</h3>
                <div className="mt-4 grid grid-cols-4 gap-2">
                    {MASTERY_LEVELS.map((mastery) => (
                        <span key={mastery} className={`border-b-2 pb-2 text-center text-sm ${skill.mastery === mastery ? "border-amber-300 text-amber-300" : "border-slate-500/60 text-slate-400"}`}>{mastery}</span>
                    ))}
                </div>
                <button type="button" disabled className="mt-6 w-full cursor-not-allowed border border-slate-500/60 bg-white/10 px-3 py-2 text-sm text-slate-400">Mejorar habilidad · 1 punto</button>
                <p className="mt-3 text-center text-xs text-slate-400">Disponible al elegir una especialidad</p>
            </aside>
        </div>
    );
};
