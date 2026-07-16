import type { CharacterSpeciality } from "netim2-shared";
import { getInfoAuraEffect, SPECIALITY_AURA_EFFECTS } from "../../utils/character-selecition-utils";
import { HoverTooltip } from "../../../../shared/tooltip/components/HoverToolTip";
import { NetimText } from "../../../../shared/typography/components/NetimText";

export const SpecialityAuraEffectIcons = ({ selectedSpeciality }: { selectedSpeciality: CharacterSpeciality | 'base' }) => {
    if (selectedSpeciality === 'base') {
        return <p>-</p>;
    }

    const effects = SPECIALITY_AURA_EFFECTS[selectedSpeciality];

    if (!effects || effects.length === 0) {
        return <NetimText text="Esta especialidad no posee auras."/>;
    }

    return (
        <>
            {effects.map((effectInfo) => (
                <HoverTooltip
                    key={effectInfo.effect}
                    message={getInfoAuraEffect(effectInfo.effect)}
                >
                    <img
                        className="w-9"
                        src={effectInfo.icon}
                        alt={effectInfo.effect}
                    />
                </HoverTooltip>
            ))}
        </>
    );
};