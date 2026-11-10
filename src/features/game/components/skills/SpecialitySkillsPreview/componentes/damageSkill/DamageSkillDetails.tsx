import { useState } from "react";
import type { SkillType } from "netim2-shared";
import { COMBAT_COLORS } from "../../../../../../../shared/colors/combat-colors";
import { getSkillIconPath } from "../../../../../../../shared/utils/get-skill-icon-path";
import { SkillProgressionPanel } from "../SkillProgressionPanel";
import { BaseDamageSection } from "./BaseDamageSection";
import { MultiHitSection } from "./MultiHitSection";
import { StatusEffectsSection } from "./StatusEffectsSection";
import { AdditionalBonusesSection } from "./AdditionalBonusesSection";
import { AmplifiersSection } from "./AmplifiersSection";
import { SkillDescriptionPanel } from "../SkillDescriptionPanel";
import { useNextSkill } from "../../skill-upgrade-preview.context";

type DamageSkill = Extract<SkillType, { type: "damage" }>;
type DamageTab = "base" | "multi" | "status" | "mechanics" | "amplifiers";

const DAMAGE_TYPE_BADGES = {
    ad: { label: "Daño físico", className: COMBAT_COLORS.ad.border },
    ap: { label: "Daño mágico", className: COMBAT_COLORS.ap.border },
    true: { label: "Daño verdadero", className: COMBAT_COLORS.true.border },
} satisfies Record<DamageSkill["components"]["damageType"], { label: string; className: string }>;

const STATUS_EFFECT_BADGES = [
    { effect: "sangrado", label: "Sangrado", className: COMBAT_COLORS.sangrado.border },
    { effect: "desmayo", label: "Desmayo", className: "border-violet-400" },
    { effect: "retardo", label: "Retardo", className: "border-violet-400" },
    { effect: "veneno", label: "Veneno", className: COMBAT_COLORS.veneno.border },
    { effect: "incendio", label: "Incendio", className: COMBAT_COLORS.incendio.border },
    { effect: "electrico", label: "Eléctrico", className: COMBAT_COLORS.electrico.border },
] as const satisfies readonly { effect: keyof NonNullable<DamageSkill["statusEffects"]>; label: string; className: string }[];

interface DamageSkillDetailsProps {
    skill: DamageSkill;
    criticalDamageMultiplier: number | null;
}

export const DamageSkillDetails = ({ skill, criticalDamageMultiplier }: DamageSkillDetailsProps) => {
    const [activeTab, setActiveTab] = useState<DamageTab>("base");
    const damageType = skill.components.damageType;
    const next = useNextSkill();
    const hasNextMulti = next?.type === "damage" && Boolean(next.hitModifiers);
    const hasStatusEffects = (skill.escalado.statusEffects?.length ?? 0) > 0;
    const hasMechanicsEffects = Object.keys(skill.escalado.mechanicsEffects ?? {}).length > 0;
    const tabs: { id: DamageTab; label: string }[] = [
        { id: "base", label: "General" },
        ...(skill.hitModifiers || hasNextMulti ? [{ id: "multi" as const, label: "Multi golpes" }] : []),
        ...(hasStatusEffects ? [{ id: "status" as const, label: "Efecto de Estados" }] : []),
        ...(hasMechanicsEffects ? [{ id: "mechanics" as const, label: "Bonus Adicionales" }] : []),
        ...(skill.escalado.damageModifiers ? [{ id: "amplifiers" as const, label: "Amplificadores" }] : []),
    ];
    
    return (
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-[1.45fr_1fr] gap-4">
            <SkillDescriptionPanel mastery={skill.mastery}>
                <div className="mb-3 flex flex-wrap justify-end gap-2" aria-label="Tipos de daño y efectos">
                    <span
                        className={`rounded-full border bg-transparent px-3 py-1 text-xs font-semibold text-slate-200 ${DAMAGE_TYPE_BADGES[damageType].className}`}
                    >
                        {DAMAGE_TYPE_BADGES[damageType].label}
                    </span>
                    {skill.hitModifiers && (
                        <span className="rounded-full border border-yellow-400 bg-transparent px-3 py-1 text-xs font-semibold text-slate-200">
                            Multi Golpe
                        </span>
                    )}
                    {skill.escalado.damageModifiers && (
                        <span className="rounded-full border border-yellow-400 bg-transparent px-3 py-1 text-xs font-semibold text-slate-200">
                            Amplificación
                        </span>
                    )}
                    {STATUS_EFFECT_BADGES.filter((badge) => (skill.statusEffects?.[badge.effect] ?? 0) > 0).map((badge) => (
                        <span key={badge.effect} className={`rounded-full border bg-transparent px-3 py-1 text-xs font-semibold text-slate-200 ${badge.className}`}>
                            {badge.label}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <img src={getSkillIconPath(skill.id, skill.mastery)} alt="" className="h-14 w-14 object-contain" />
                    <div>
                        <p className="text-xs tracking-widest text-sky-200">{skill.mastery === "N" ? "NORMAL" : skill.mastery} · NIVEL {skill.lv}</p>
                        <h3 className="font-metin text-[26px] text-amber-300">{skill.nombre}</h3>
                    </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">{skill.description}</p>
                <div role="tablist" aria-label="Detalles de la habilidad" className="mt-5 flex flex-wrap gap-1 border-b border-slate-500/40">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer border-b-2 px-3 py-2 text-xs transition-colors hover:text-amber-200 ${activeTab === tab.id ? "border-amber-400 text-amber-300" : "border-transparent text-slate-300"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div role="tabpanel" className="min-h-24 pt-4">
                    {activeTab === "base" && (
                        <BaseDamageSection skill={skill} criticalDamageMultiplier={criticalDamageMultiplier} />
                    )}
                    {activeTab === "multi" && <MultiHitSection skill={skill} criticalDamageMultiplier={criticalDamageMultiplier} />}
                    {activeTab === "status" && <StatusEffectsSection skill={skill} />}
                    {activeTab === "mechanics" && <AdditionalBonusesSection skill={skill} />}
                    {activeTab === "amplifiers" && <AmplifiersSection skill={skill} criticalDamageMultiplier={criticalDamageMultiplier} />}
                </div>
            </SkillDescriptionPanel>

            <SkillProgressionPanel mastery={skill.mastery} lv={skill.lv} />
        </div>
    )
}
