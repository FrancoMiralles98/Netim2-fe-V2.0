import type { AttributesRefKeys, CharacterSpeciality } from "netim2-shared";
import { useCharacterSession } from "../../../../../characterSession/hooks/useCharacterSession";
import { StatBar } from "../../../../../../shared/bars/components/StatBar";
import { InfoTooltip } from "../../../../../../shared/tooltip/components/InfoToolTip";

const ATTRIBUTE_ORDER = ["VIT", "STR", "INT", "DEX"] as const satisfies readonly AttributesRefKeys[];

interface SpecialityAttributeCapsProps {
    especialidad: CharacterSpeciality | null;
}

export const SpecialityAttributeCaps = ({ especialidad }: SpecialityAttributeCapsProps) => {
    const { gameConfig } = useCharacterSession();
    const caps = especialidad
        ? gameConfig?.character.speciality.find((entry) => entry.specialidad === especialidad)?.caps
        : gameConfig?.character.race;

    if (!caps) return null;

    return (
        <section aria-label={`Caps de atributos de ${especialidad ?? "la raza"}`} className="w-full  p-2 text-left font-sans text-orange-200">
            <div className="mb-2 flex items-center justify-center gap-2 text-[15px]">
                <span>Max Stats:</span>
                <span>{especialidad ?? "Sin Especialidad"}</span>
                <InfoTooltip
                    title="Max Stats"
                    message="Estos son los límites de puntos 'Por nivel' de cada atributo para la especialidad seleccionada. Los bonus de equipo pueden superar estos límites hasta el cap máximo."
                    position="top"
                    size="small"
                />
            </div>
            {ATTRIBUTE_ORDER.map((stat) => (
                <StatBar key={stat} name={stat} value={caps[stat]} isActive animationKey={especialidad ?? "base"} />
            ))}
        </section>
    );
};
