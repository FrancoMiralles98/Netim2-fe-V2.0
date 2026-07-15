import type { CharacterSelectionDataType } from "netim2-shared"
import { useCreation } from "../../hooks/useCreation"
import type { CharacterSelectionType } from "../../types/character-selection.type"
import { CharacterCreation } from "./CharacterCreation"
import { ReinoSelection } from "./ReinoSelection"

export const Creation = (
    { changeType, characterCreationConfig }:
        { changeType: (typeToChange: CharacterSelectionType) => void, characterCreationConfig: CharacterSelectionDataType | null }
) => {

    const { changeInstance, creationInstance, newAccount, handleCreateCharacter } = useCreation()

    return (
        <div>
            {
                creationInstance === 'select_reino' &&
                characterCreationConfig &&
                newAccount &&
                <>
                    <ReinoSelection
                        reinoBuff={characterCreationConfig.reinoBuff}
                        changeInstance={changeInstance}
                        changeType={changeType} />
                </>
            }
            {
                creationInstance === 'select_raza' && characterCreationConfig &&
                <>
                    <CharacterCreation
                        handleCreateCharacter={handleCreateCharacter}
                        attributeLimit={characterCreationConfig.attributeLimit}
                        races={characterCreationConfig.races}
                        changeType={changeType}

                    />
                </>
            }

        </div>
    )
}