import { useState } from "react";
import type { CharacterRaceInfo } from "../types/character-creation-card.types";
import type { CharacterSpeciality } from "../../../shared/types/backend/character/character-backend.types";
import { getBackGroundColor, getMainDamageInfo } from "../utils/character-selecition-utils";

export const useCharacterCreationCard = (raceInfo: CharacterRaceInfo) => {
    const [selectedSpeciality, setSelectedSpeciality] = useState<CharacterSpeciality | 'base'>('base');
    const [characterName, setCharacterName] = useState('');
    const [genero, setGenero] = useState<'masculino' | 'femenino'>('masculino');

    const specialityKeys = Object.keys(raceInfo.especialidades).filter(
        (key): key is CharacterSpeciality => key !== 'base',
    );

    const changeName = (value: string) => {
        setCharacterName(value);
    };

    const changeGenero = (newGenero: 'masculino' | 'femenino') => {
        setGenero(newGenero);
    };

    const speciality1 = specialityKeys[0];
    const speciality2 = specialityKeys[1];

    const selectedStats = raceInfo.especialidades[selectedSpeciality]?.statsLimit;

    const mainDamageInfo = getMainDamageInfo(raceInfo.raza, selectedSpeciality);

    const getImageClass = (type: CharacterSpeciality | 'base') => {
        const isSelected = selectedSpeciality === type;

        return `
      justify-self-center cursor-pointer-custom transition-all duration-300
      ${isSelected
                ? `scale-110 brightness-110 ${getBackGroundColor(type)} animate-pulse`
                : 'brightness-50 opacity-95 grayscale hover:brightness-90 hover:opacity-80 hover:grayscale-0'
            }
    `;
    };

    return {
        genero,
        changeGenero,
        selectedSpeciality,
        setSelectedSpeciality,
        speciality1,
        speciality2,
        selectedStats,
        mainDamageInfo,
        characterName,
        getImageClass, 
        changeName
    };
};