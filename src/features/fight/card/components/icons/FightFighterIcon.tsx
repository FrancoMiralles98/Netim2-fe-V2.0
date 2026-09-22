export interface FightFighterIconProps {
    fighterName: string;
    className?: string;
}

export const FightFighterIcon = ({
    fighterName,
    className = ''
}: FightFighterIconProps) => (
    <img
        src={getIconRace('guerrero', 'masculino')}
        alt={fighterName}
        title={fighterName}
        className={`
            h-[40px]
            min-w-[41px]
            max-w-[41px]
            object-contain
            ${className}
        `}
    />
);
import { getIconRace } from "../../../../characterSelection/utils/character-selecition-utils";
