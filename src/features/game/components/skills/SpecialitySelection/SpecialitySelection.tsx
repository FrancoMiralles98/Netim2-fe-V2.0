import { useState } from "react";
import type { CharacterSession, CharacterSpeciality, SkillType } from "netim2-shared";
import { getSkillIconPath } from "../../../../../shared/utils/get-skill-icon-path";
import { useCharacterSession } from "../../../../characterSession/hooks/useCharacterSession";
import { SpecialityArtwork } from "./componentes/SpecialityArtwork";
import { SpecialityAttributeCaps } from "./componentes/SpecialityAttributeCaps";
import { SpecialityEffectIcons } from "../../../../characterSelection/components/creation/SpecialityEffectIcons";
import { SpecialityAuraEffectIcons } from "../../../../characterSelection/components/creation/SpecialityAuraEffectIcon";
import { useModal } from "../../../../../shared/modal/hooks/useModal";
import { getCharacterSpecialitySkillsRequest } from "../../../api/character-skills.services";
import { SpecialitySkillsPreview } from "../SpecialitySkillsPreview/SpecialitySkillsPreview";
import { resolveCriticalDamageMultiplier } from "../utils/resolve-critical-damage-multiplier";
import { SPECIALITIES_BY_RACE, SPECIALITY_BUTTON_IMAGES } from "./specialities.config";
import { useSpecialityActions } from "../../../hooks/useSpecialityActions";
import { MIN_SPECIALITY_LEVEL } from "../../../skills.constants";

interface SpecialitySelectionProps {
    character: CharacterSession;
}

export const SpecialitySelection = ({ character }: SpecialitySelectionProps) => {
    const { reino, raza } = character;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [preview, setPreview] = useState<{ speciality: CharacterSpeciality; skills: SkillType[]; criticalDamageMultiplier: number } | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const { gameConfig } = useCharacterSession();
    const modal = useModal();
    const { selectSpeciality, isPending: isSelecting } = useSpecialityActions(character);
    const specializations = SPECIALITIES_BY_RACE[raza];
    const selected = specializations[selectedIndex];
    const skillIds = gameConfig?.character.idSkillsSpeciality.find(
        (entry) => entry.specialidad === selected.icon,
    )?.idSkills ?? [];

    const openPreview = async () => {
        if (isPreviewLoading || isSelecting || character.lv < MIN_SPECIALITY_LEVEL || character.especialidad) return;

        setIsPreviewLoading(true);
        try {
            const response = await getCharacterSpecialitySkillsRequest(character.id, { speciality: selected.icon });
            setPreview({
                speciality: selected.icon,
                skills: response.skills,
                criticalDamageMultiplier: response.stats.bonus.daño.daño_critico,
            });
        } catch (error) {
            modal.showErrorModal(error);
        } finally {
            setIsPreviewLoading(false);
        }
    };

    if (preview) {
        const criticalDamageMultiplier = resolveCriticalDamageMultiplier(
            preview.criticalDamageMultiplier,
            character.stats.bonus.daño.daño_critico,
        );

        return (
            <SpecialitySkillsPreview
                skills={preview.skills}
                criticalDamageMultiplier={criticalDamageMultiplier}
                speciality={preview.speciality}
                race={raza}
                availablePoints={character.puntos_habilidad}
                reino={reino}
                onBack={() => setPreview(null)}
            />
        );
    }

    return (
        <section
            aria-label="Habilidades del personaje"
            className="relative aspect-[4/3] w-[1100px] justify-self-center overflow-hidden bg-[length:100%_100%] bg-no-repeat font-metin text-[#f5e1b5]"
            style={{ backgroundImage: reino ? `url('/game/modal-${reino}-rectangular.png')` : undefined }}
        >
            <SpecialityArtwork especialidad={selected.icon} />
            <div className="absolute inset-x-[6%] top-[8%] bottom-[7%] z-10 grid grid-cols-[43%_1fr] gap-10">
                <div className="flex min-h-0 flex-col">
                    <header className="mb-8 pt-8 text-center">
                        <h1 className="text-[23px] font-semibold uppercase leading-tight">Elige tu especialidad</h1>
                    </header>

                    <div className="flex flex-col gap-3">
                        {specializations.map((specialization, index) => (
                            <button
                                key={specialization.icon}
                                type="button"
                                aria-label={specialization.name}
                                aria-pressed={selectedIndex === index}
                                disabled={isSelecting}
                                onClick={() => setSelectedIndex(index)}
                                className={`mx-auto grid h-[92px] w-[60%] cursor-pointer place-items-center rounded-sm transition-[filter,opacity] focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-wait motion-reduce:transition-none ${selectedIndex === index ? "brightness-110 drop-shadow-[0_0_6px_#e7ae5270]" : "opacity-80 hover:opacity-100"}`}
                            >
                                <img
                                    src={SPECIALITY_BUTTON_IMAGES[specialization.icon]}
                                    alt=""
                                    className="h-full min-h-0 w-full object-contain"
                                />
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pb-[10rem]">
                        <p className="text-center font-semibold uppercase leading-none">Atributos</p>
                        <hr className="my-3 mx-auto w-[80%] border-amber-200/60" />
                        <SpecialityAttributeCaps especialidad={selected.icon} />
                    </div>

                </div>

                <div className="flex min-h-0 flex-col pb-2">
                    <div className="mb-5 min-h-[230px] flex-1" />

                    <div>
                        <h2 className="text-[38px] font-semibold uppercase leading-none">{selected.name}</h2>
                        <hr className="my-3 border-amber-200/60" />
                        {selected.icon && (
                            <div className="flex min-h-9 items-center gap-4" aria-label={`Efectos de ${selected.name}`}>
                                <div className="flex items-center gap-3" aria-label="Efectos de habilidades">
                                    <SpecialityEffectIcons selectedSpeciality={selected.icon} />
                                </div>
                                <span className="h-7 border-l border-amber-200/40" aria-hidden="true" />
                                <div className="flex items-center gap-3" aria-label="Efectos de auras">
                                    <SpecialityAuraEffectIcons selectedSpeciality={selected.icon} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-4">
                            <hr className="flex-1 border-amber-200/50" />
                            <h3 className="text-[19px]">Habilidades</h3>
                            <hr className="flex-1 border-amber-200/50" />
                        </div>
                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                            {skillIds.map((skillId) => (
                                <div key={skillId} className="h-9 w-9">
                                    <img
                                        src={getSkillIconPath(skillId, "N")}
                                        alt={`Habilidad ${skillId}`}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-7 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => { void selectSpeciality(selected.icon); }}
                                disabled={isSelecting || isPreviewLoading}
                                className="min-w-[130px] cursor-pointer border border-amber-200/70 bg-black/65 px-4 py-2 text-[16px] transition-colors hover:bg-amber-200/15"
                            >
                                Elegir
                            </button>
                            <button
                                type="button"
                                onClick={() => { void openPreview(); }}
                                disabled={isPreviewLoading || isSelecting}
                                className="min-w-[130px] cursor-pointer border border-amber-200/70 bg-black/65 px-4 py-2 text-[16px] transition-colors hover:bg-amber-200/15"
                            >
                                {isPreviewLoading ? "Cargando..." : "Vista previa"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
