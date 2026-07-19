import { HoverTooltip } from "../../../../shared/tooltip/components/HoverToolTip";
import type { CharacterSpeciality } from "../../../../shared/types/backend/character/character-backend.types";
import { getInfoEffect, SPECIALITY_EFFECTS } from "../../utils/character-selecition-utils";

export const SpecialityEffectIcons = ({selectedSpeciality}: {selectedSpeciality: CharacterSpeciality |'base'}) => {
  if (selectedSpeciality === 'base') {
    return <p>-</p>;
  }

  const effects = SPECIALITY_EFFECTS[selectedSpeciality];

  if (!effects || effects.length === 0) {
    return <p>-</p>;
  }

  return (
    <>
      {effects.map((effectInfo) => (
        <HoverTooltip
          key={effectInfo.effect}
          message={getInfoEffect(effectInfo.effect)}
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