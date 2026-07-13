import { useCreation } from "../../hooks/useCreation"
import type { CharacterSelectionType } from "../../types/character-selection.type"
import { CharacterCreation } from "./CharacterCreation"
import { ReinoSelection } from "./ReinoSelection"

export const Creation = ({ changeType }: { changeType: (typeToChange: CharacterSelectionType) => void }) => {

    const { changeInstance, creationInstance } = useCreation()

    return (
        <div>

            {
                creationInstance === 'select_reino' &&
                <>
                    <ReinoSelection changeInstance={changeInstance} changeType={changeType}/>
                </>
            }
            {
                creationInstance === 'select_raza' &&
                <>
                    <CharacterCreation changeType={changeType} />
                </>
            }

        </div>
    )
}