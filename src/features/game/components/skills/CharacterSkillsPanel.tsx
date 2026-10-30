import type { CharacterSession } from "netim2-shared";
import { SpecialitySelection } from "./SpecialitySelection/SpecialitySelection";
import { SpecialitySkillsPreview } from "./SpecialitySkillsPreview/SpecialitySkillsPreview";
import { resolveCriticalDamageMultiplier } from "./utils/resolve-critical-damage-multiplier";

interface CharacterSkillsPanelProps {
    character: CharacterSession;
}

export const CharacterSkillsPanel = ({ character }: CharacterSkillsPanelProps) => {
    if (!character.especialidad) {
        return <SpecialitySelection key={character.id} character={character} />;
    }

    return (
        <SpecialitySkillsPreview
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
