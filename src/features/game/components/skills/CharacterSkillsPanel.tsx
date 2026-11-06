import type { CharacterSession } from "netim2-shared";
import { SpecialitySelection } from "./SpecialitySelection/SpecialitySelection";
import { SpecialitySkillsPreview } from "./SpecialitySkillsPreview/SpecialitySkillsPreview";
import { resolveCriticalDamageMultiplier } from "./utils/resolve-critical-damage-multiplier";
import { MIN_SPECIALITY_LEVEL } from "../../skills.constants";

interface CharacterSkillsPanelProps {
    character: CharacterSession;
}

export const CharacterSkillsPanel = ({ character }: CharacterSkillsPanelProps) => {
    if (!character.especialidad) {
        if (character.lv < MIN_SPECIALITY_LEVEL) {
            return (
                <section
                    aria-label="Especialidades bloqueadas"
                    className="relative flex aspect-[4/3] w-[1100px] items-center justify-center justify-self-center bg-[length:100%_100%] bg-no-repeat"
                    style={{ backgroundImage: character.reino ? `url('/game/modal-${character.reino}-rectangular.png')` : undefined }}
                >
                    <p className="max-w-md border border-amber-200/40 bg-black/65 p-5 text-center text-[#f5e1b5]">
                        La selección de especialidad y la vista previa de habilidades se habilitarán cuando tu personaje llegue al nivel {MIN_SPECIALITY_LEVEL}.
                    </p>
                </section>
            );
        }
        return <SpecialitySelection key={character.id} character={character} />;
    }

    return (
        <SpecialitySkillsPreview
            character={character}
            key={`${character.id}-${character.especialidad}`}
            skills={character.hab}
            criticalDamageMultiplier={resolveCriticalDamageMultiplier(character.stats.bonus.daño.daño_critico)}
            speciality={character.especialidad}
            race={character.raza}
            availablePoints={character.puntos_habilidad}
            reino={character.reino}
        />
    );
};
