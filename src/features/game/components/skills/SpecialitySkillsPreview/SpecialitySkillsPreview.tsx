import { useState, type CSSProperties } from "react";
import type { CharacterRace, CharacterSession, CharacterSpeciality, ReinosNames, SkillType } from "netim2-shared";
import { SkillMasteryIcon } from "../../../../../shared/animations";
import { getSkillIconPath } from "../../../../../shared/utils/get-skill-icon-path";
import { DamageSkillDetails } from "./componentes/damageSkill/DamageSkillDetails";
import { AuraSkillDetails } from "./componentes/auraSkill/AuraSkillDetails";
import { SkillResourceCosts } from "./componentes/SkillResourceCosts";
import { SkillProgressionPanel } from "./componentes/SkillProgressionPanel";
import { useSkillUpgradePreview } from "../../../hooks/useSkillUpgradePreview";
import { SkillUpgradePreviewContext } from "./skill-upgrade-preview.context";
import { SkillNextValue } from "./componentes/SkillNextValue";
import { SkillDescriptionPanel } from "./componentes/SkillDescriptionPanel";
import { SPECIALITIES_BY_RACE, SPECIALITY_BUTTON_IMAGES } from "../SpecialitySelection/specialities.config";

interface SpecialitySkillsPreviewProps {
    character?: CharacterSession;
    skills: SkillType[];
    criticalDamageMultiplier: number | null;
    speciality: CharacterSpeciality;
    race: CharacterRace;
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
                <p>Curación: {skill.components.range.min} – {skill.components.range.max} de vida<SkillNextValue select={value => value.type === "heal" ? `${value.components.range.min.toLocaleString("es-AR", { maximumFractionDigits: 2 })} – ${value.components.range.max.toLocaleString("es-AR", { maximumFractionDigits: 2 })} de vida` : null} /></p>
            );
        case "buff":
            return (
                <div className="space-y-1">
                    {skill.stats.map((modifier, index) => (
                        <p key={index}>{modifier.bonusRefKey}: {modifier.value > 0 ? "+" : ""}{modifier.value} {modifier.operation === "flat" ? "puntos" : "%"}<SkillNextValue select={value => value.type === "buff" ? value.stats.find(item => item.target === modifier.target && item.operation === modifier.operation)?.value : null} /></p>
                    ))}
                    {skill.effects.map((effect, index) => (
                        <div key={`effect-${index}`} className="space-y-2 text-sm">
                            {effect.description && <p>{effect.description}</p>}
                            <p>Multiplicador de daño: ×{effect.multiplier}<SkillNextValue select={value => value.type === "buff" ? value.effects[index]?.multiplier : null} /></p>
                            <p>Usos: {effect.uses}<SkillNextValue select={value => value.type === "buff" ? value.effects[index]?.uses : null} /></p>
                        </div>
                    ))}
                    {!skill.stats.length && !skill.effects.length && <p>Aplica un beneficio temporal.</p>}
                </div>
            );
    }
};

export const SpecialitySkillsPreview = ({ character, skills, criticalDamageMultiplier, speciality, race, availablePoints, reino, onBack }: SpecialitySkillsPreviewProps) => {
    const specialityName = SPECIALITIES_BY_RACE[race].find(({ icon }) => icon === speciality)?.name ?? speciality;
    const [selectedSkillId, setSelectedSkillId] = useState<SkillType["id"] | null>(skills[0]?.id ?? null);
    const selected = skills.find((skill) => skill.id === selectedSkillId) ?? skills[0];
    const preview = useSkillUpgradePreview(onBack ? undefined : character, selected);
    const selectedSkill = preview.data?.current ?? selected;

    return (
        <SkillUpgradePreviewContext.Provider value={preview}>
            <section
                aria-label={`${onBack ? "Vista previa de habilidades" : "Habilidades"} de ${speciality}`}
                className="relative aspect-[4/3] w-[1100px] justify-self-center overflow-hidden bg-[length:100%_100%] bg-no-repeat font-sans text-[#e8e0d4]"
                style={{ backgroundImage: reino ? `url('/game/modal-${reino}-rectangular.png')` : undefined }}
            >
                <div
                    className="absolute inset-x-[6%] top-[7%] bottom-[7%] flex flex-col"
                    style={{ "--skill-panel-frame": selectedSkill ? `url('/modal/skills/marc-${selectedSkill.mastery}.png')` : undefined } as CSSProperties}
                >
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
                        <h1 className="h-[92px] w-[25.8%] shrink-0">
                            <img
                                src={SPECIALITY_BUTTON_IMAGES[speciality]}
                                alt={specialityName}
                                className="h-full w-full object-contain"
                            />
                        </h1>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-b border-amber-200/25 bg-[#17191b]/90 px-5 py-3">
                        <p className="text-sm">Puntos disponibles: <span className="ml-2 text-xl text-amber-300">{availablePoints}</span></p>
                    </div>

                    <div className="mt-4 flex justify-around gap-3">
                        {skills.map((skill) => (
                            <button
                                key={skill.id}
                                type="button"
                                aria-pressed={selectedSkill?.id === skill.id}
                                onClick={() => setSelectedSkillId(skill.id)}
                                className={`flex min-w-0 bg-[#101214]/90 flex-1 cursor-pointer flex-col items-center gap-[0.5] rounded-sm bg-[length:100%_100%] bg-no-repeat px-2 py-7 text-center ${selectedSkill?.id === skill.id ? "text-amber-300" : "text-slate-200"}`}
                                style={{ backgroundImage: `url('/modal/skills/marc-icon-${skill.mastery}.png')` }}
                            >
                                <span className="grid h-17 w-14 place-items-center">
                                    <SkillMasteryIcon src={getSkillIconPath(skill.id, skill.mastery)} alt="" mastery={skill.mastery} />
                                </span>
                                <span className="max-w-full truncate text-xs">{skill.nombre}</span>
                                <span className="text-xs text-slate-400">{skill.mastery === "P" ? "P" : `Nv. ${skill.mastery === "N" ? "" : skill.mastery}${skill.lv}`}</span>
                            </button>
                        ))}
                    </div>

                    {selectedSkill?.type === "damage" ? (
                        <DamageSkillDetails key={selectedSkill.id} skill={selectedSkill} criticalDamageMultiplier={criticalDamageMultiplier} />
                    ) : selectedSkill?.type === "aura" ? (
                        <AuraSkillDetails key={selectedSkill.id} skill={selectedSkill} />
                    ) : selectedSkill ? (
                        <div className="mt-4 grid min-h-0 flex-1 grid-cols-[1.45fr_1fr] gap-4">
                            <SkillDescriptionPanel mastery={selectedSkill.mastery}>
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
                                <SkillResourceCosts skill={selectedSkill} showDuration={selectedSkill.type === "buff"} />
                                <p className="mt-4 inline-block border border-slate-500/60 px-2 py-1 text-xs text-sky-200">{SKILL_TYPE_LABELS[selectedSkill.type]}</p>
                                {selectedSkill.type === "heal" && selectedSkill.weaponRestricted.length > 0 && (
                                    <div className="mt-5 border-t border-slate-500/40 pt-3 text-sm">
                                        <p>Armas compatibles</p>
                                        <p className="mt-1 capitalize text-amber-200">{selectedSkill.weaponRestricted.join(" · ").replaceAll("_", " ")}</p>
                                    </div>
                                )}
                            </SkillDescriptionPanel>

                            <SkillProgressionPanel mastery={selectedSkill.mastery} lv={selectedSkill.lv} />
                        </div>
                    ) : (
                        <p className="mt-8 text-center text-slate-300">Esta especialidad no tiene habilidades disponibles.</p>
                    )}
                </div>
            </section>
        </SkillUpgradePreviewContext.Provider>
    );
};
