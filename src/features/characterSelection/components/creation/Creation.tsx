import type { RaceInfo } from "netim2-shared"
import { useCreation } from "../../hooks/useCreation"
import type { CharacterSelectionType } from "../../types/character-selection.type"
import { CharacterCreation } from "./CharacterCreation"
import { ReinoSelection } from "./ReinoSelection"

export const Creation = (
    { changeType, races, attributeLimit }:
        { changeType: (typeToChange: CharacterSelectionType) => void, races: RaceInfo[], attributeLimit: number }
) => {

    const { changeInstance, creationInstance } = useCreation()

    return (
        <div>
            {
                creationInstance === 'select_reino' &&
                <>
                    <ReinoSelection changeInstance={changeInstance} changeType={changeType} />
                </>
            }
            {
                creationInstance === 'select_raza' &&
                <>
                    <CharacterCreation attributeLimit={attributeLimit} races={races} changeType={changeType} />
                </>
            }

        </div>
    )
}