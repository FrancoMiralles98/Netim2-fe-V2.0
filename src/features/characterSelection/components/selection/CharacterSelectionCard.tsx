import type { CharacterSpeciality } from "netim2-shared"
import { getBackGroundColor } from "../../utils/character-selecition-utils"
import type { CharacterSelectionCardProps } from "../../types/props/character-selection-card-props"
import { useModal } from "../../../../shared/modal/hooks/useModal"
import { useUserSession } from "../../../userSession/hook/useUserSession"
import { ChunjoCard } from "./reinoModal/ChunjoCard"
import { JinnoCard } from "./reinoModal/JinnoCard"
import { ShinsooCard } from "./reinoModal/ShinsooCard"

export const CharacterSelectionCard = ({ character, isActive, maxAttributeValue, handleDeleteCharacter, handleConnectCharacter }: CharacterSelectionCardProps) => {

    const modal = useModal()
    const { user } = useUserSession()


    const getImageClass = (type?: CharacterSpeciality) => {
        const isSelected = true

        return `
      justify-self-center cursor-pointer-custom transition-all duration-300
      ${isSelected
                ? `scale-110 brightness-110 ${getBackGroundColor(type ? type : 'base')} `
                : 'brightness-50 opacity-95 grayscale hover:brightness-90 hover:opacity-80 hover:grayscale-0'
            }`;
    };


    const handleDeleteClick = () => {
        modal.showActionModal({
            acceptText: 'Eliminar',
            title: 'Eliminar Personaje',
            subTitle: `Estas seguro que quieres eliminar a tu personaje: ${character.nombre} ?`,
            cancelText: 'Cancelar',
            onAccept: () => { handleDeleteCharacter(character) }
        })
    }

    const handleConnectClick = () => {
        handleConnectCharacter(character)
    }

    return (
        <>
            {
                user && user.reino &&
                <>
                    {
                        user.reino === 'chunjo' &&
                        <ChunjoCard
                            character={character}
                            getImageClass={getImageClass}
                            handleDeleteClick={handleDeleteClick}
                            handleConnectClick={handleConnectClick}
                            isActive={isActive}
                            maxAttributeValue={maxAttributeValue}
                        />
                    }
                    {
                        user.reino === 'jinno' &&
                        <JinnoCard
                            character={character}
                            getImageClass={getImageClass}
                            handleDeleteClick={handleDeleteClick}
                            handleConnectClick={handleConnectClick}
                            isActive={isActive}
                            maxAttributeValue={maxAttributeValue}
                        />
                    }
                    {
                        user.reino === 'shinsoo' &&
                        <ShinsooCard
                            character={character}
                            getImageClass={getImageClass}
                            handleDeleteClick={handleDeleteClick}
                            handleConnectClick={handleConnectClick}
                            isActive={isActive}
                            maxAttributeValue={maxAttributeValue}
                        />
                    }
                </>
            }

        </>
    )
}