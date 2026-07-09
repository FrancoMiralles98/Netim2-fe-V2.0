import { useCreation } from "../../hooks/useCreation"
import type { CharacterSelectionType } from "../../types/character-selection.type"

export const Creation = ({ changeType }: { changeType: (typeToChange: CharacterSelectionType) => void }) => {

    const { changeInstance, creationInstance } = useCreation()

    return (
        <div>
            <h1>Crea tu personaje</h1>
            
        </div>
    )
}