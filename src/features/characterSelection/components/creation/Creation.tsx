import type { CharacterSelectionDataType } from "netim2-shared"
import { useCreation } from "../../hooks/useCreation"
import type { CharacterSelectionType } from "../../types/character-selection.type"
import { CharacterCreation } from "./CharacterCreation"
import { ReinoSelection } from "./ReinoSelection"

export const Creation = (
    { changeType, characterCreationConfig }:
        { changeType: (typeToChange: CharacterSelectionType) => void, characterCreationConfig: CharacterSelectionDataType | null }
) => {

    const { changeInstance, creationInstance } = useCreation()

    return (
        <div>
            {
                creationInstance === 'select_reino' && characterCreationConfig &&
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
                        attributeLimit={characterCreationConfig.attributeLimit}
                        races={characterCreationConfig.races}
                        changeType={changeType} />
                </>
            }

        </div>
    )
}