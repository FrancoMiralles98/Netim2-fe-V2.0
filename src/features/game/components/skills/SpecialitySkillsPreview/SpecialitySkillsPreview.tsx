import { useState } from "react";
import type { CharacterSpeciality, ReinosNames, SkillType } from "netim2-shared";
import { getSkillIconPath } from "../../../../../shared/utils/get-skill-icon-path";
import { DamageSkillDetails } from "./componentes/damageSkill/DamageSkillDetails";
import { AuraSkillDetails } from "./componentes/auraSkill/AuraSkillDetails";
import { formatCooldown, formatManaCost, MASTERY_LEVELS } from "../utils/skill-preview-formatters";

interface SpecialitySkillsPreviewProps {
    skills: SkillType[];
    criticalDamageMultiplier: number | null;
    speciality: CharacterSpeciality;
    race: string;
    availablePoints: number;
    reino: ReinosNames | null;
    onBack?: () => void;
}

const SKILL_TYPE_LABELS: Record<SkillType["type"], string> = {
    damage: "Daño",
    aura: "Aura",
    buff: "Beneficio",
    heal: "Curación",
};

const SkillEffectDetails = ({ skill }: { skill: Exclude<SkillType, { type: "damage" | "aura" }> }) => {
    switch (skill.type) {
        case "heal":
            return (
                <div className="space-y-1">
                    {skill.components.map((component, index) => (
                        <p key={index}>Curación {index + 1}: {component.range.min}–{component.range.max} de vida</p>
                    ))}
                </div>
            );
        case "buff":
            return skill.stats.length > 0 ? (
                <div className="space-y-1">
                    {skill.stats.map((modifier, index) => (
                        <p key={index}>{modifier.bonusRefKey}: {modifier.value > 0 ? "+" : ""}{modifier.value} {modifier.operation === "flat" ? "puntos" : "%"}</p>
                    ))}
                </div>
            ) : <p>{skill.effects[0]?.description ?? "Aplica un beneficio temporal."}</p>;
    }
};

export const SpecialitySkillsPreview = ({ skills, criticalDamageMultiplier, speciality, race, availablePoints, reino, onBack }: SpecialitySkillsPreviewProps) => {
    const [selectedSkillId, setSelectedSkillId] = useState<SkillType["id"] | null>(skills[0]?.id ?? null);
    const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? skills[0];

    return (
        <section
            aria-label={`Vista previa de habilidades de ${speciality}`}
            className="relative aspect-[4/3] w-[1100px] justify-self-center overflow-hidden bg-[length:100%_100%] bg-no-repeat font-sans text-[#e8e0d4]"
            style={{ backgroundImage: reino ? `url('/game/modal-${reino}-rectangular.png')` : undefined }}
        >
            <div className="absolute inset-x-[6%] top-[7%] bottom-[7%] flex flex-col">
                <div className="relative flex items-center justify-center">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="absolute left-0 cursor-pointer border border-amber-200/60 bg-black/65 px-4 py-2 text-sm text-amber-100 transition-colors hover:bg-amber-200/15"
                        >
                            ← Volver
                        </button>
                    )}
                    <h1 className="text-center font-metin text-[30px] text-[#f5e1b5]">Habilidades</h1>
                </div>

                <div className="mt-4 flex items-center justify-between border-b border-amber-200/25 bg-[#17191b]/90 px-5 py-3">
                    <div className="flex items-baseline gap-3">
                        <h2 className="font-metin text-[22px] text-amber-300">{speciality}</h2>
                        <span className="text-sm capitalize text-slate-300">{race}</span>
                    </div>
                    <p className="text-sm">Puntos disponibles: <span className="ml-2 text-xl text-amber-300">{availablePoints}</span></p>
                </div>

                <div className="mt-4 flex justify-around gap-3 border border-slate-500/45 bg-[#101214]/90 p-4">
                    {skills.map((skill) => (
                        <button
                            key={skill.id}
                            type="button"
                            aria-pressed={selectedSkill?.id === skill.id}
                            onClick={() => setSelectedSkillId(skill.id)}
                            className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 rounded-sm px-2 py-1 text-center hover:bg-white/10 ${selectedSkill?.id === skill.id ? "text-amber-300" : "text-slate-200"}`}
                        >
                            <img src={getSkillIconPath(skill.id, skill.mastery)} alt="" className={`h-10 w-10 bg-black object-contain `} />
                            <span className="max-w-full truncate text-xs">{skill.nombre}</span>
                            <span className="text-xs text-slate-400">Nv. {skill.lv}</span>
                        </button>
                    ))}
                </div>

                {selectedSkill?.type === "damage" ? (
                    <DamageSkillDetails key={selectedSkill.id} skill={selectedSkill} criticalDamageMultiplier={criticalDamageMultiplier} />
                ) : selectedSkill?.type === "aura" ? (
                    <AuraSkillDetails key={selectedSkill.id} skill={selectedSkill} />
                ) : selectedSkill ? (
                    <div className="mt-4 grid min-h-0 flex-1 grid-cols-[1.45fr_1fr] gap-4">
                        <article className="min-h-0 overflow-y-auto border border-slate-500/45 bg-[#1a1c1e]/95 p-5">
                            <div className="flex items-center gap-4">
                                <img src={getSkillIconPath(selectedSkill.id, selectedSkill.mastery)} alt="" className="h-16 w-16 border border-amber-200/60 object-contain" />
                                <div>
                                    <p className="text-xs tracking-widest text-sky-200">{selectedSkill.mastery === "N" ? "NORMAL" : selectedSkill.mastery} · NIVEL {selectedSkill.lv}</p>
                                    <h3 className="font-metin text-[26px] text-amber-300">{selectedSkill.nombre}</h3>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed">{selectedSkill.description}</p>
                            <hr className="my-5 border-slate-500/40" />
                            <p className="text-xs text-sky-200">Efecto de la habilidad</p>
                            <div className="mt-2 font-metin text-lg text-amber-300"><SkillEffectDetails skill={selectedSkill} /></div>
                            <hr className="my-5 border-slate-500/40" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p>Coste de maná<br /><span className="text-sky-200">{formatManaCost(selectedSkill.mana)}</span></p>
                                <p>Enfriamiento<br /><span className="text-sky-200">{formatCooldown(selectedSkill)}</span></p>
                            </div>
                            <p className="mt-4 inline-block border border-slate-500/60 px-2 py-1 text-xs text-sky-200">{SKILL_TYPE_LABELS[selectedSkill.type]}</p>
                            {selectedSkill.type === "heal" && selectedSkill.weaponRestricted.length > 0 && (
                                <div className="mt-5 border-t border-slate-500/40 pt-3 text-sm">
                                    <p>Armas compatibles</p>
                                    <p className="mt-1 capitalize text-amber-200">{selectedSkill.weaponRestricted.join(" · ").replaceAll("_", " ")}</p>
                                </div>
                            )}
                        </article>

                        <aside className="self-start border border-slate-500/45 bg-[#1a1c1e]/95 p-5">
                            <p className="text-xs tracking-widest text-sky-200">PROGRESIÓN</p>
                            <h3 className="mt-1 font-metin text-lg text-amber-100">{selectedSkill.mastery === "N" ? "Normal" : selectedSkill.mastery} · Nivel {selectedSkill.lv}</h3>
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {MASTERY_LEVELS.map((mastery) => (
                                    <span key={mastery} className={`border-b-2 pb-2 text-center text-sm ${selectedSkill.mastery === mastery ? "border-amber-300 text-amber-300" : "border-slate-500/60 text-slate-400"}`}>{mastery}</span>
                                ))}
                            </div>

                            <button type="button" disabled className="mt-6 w-full cursor-not-allowed border border-slate-500/60 bg-white/10 px-3 py-2 text-sm text-slate-400">Mejorar habilidad · 1 punto</button>
                            <p className="mt-3 text-center text-xs text-slate-400">Disponible al elegir una especialidad</p>
                        </aside>
                    </div>
                ) : (
                    <p className="mt-8 text-center text-slate-300">Esta especialidad no tiene habilidades disponibles.</p>
                )}
            </div>
        </section>
    );
};
