import { useState } from "react"
import type { CharacterSelectionType } from "../types/character-selection.type"

export const useCharacterSelection = () => {
    const [type, setType] = useState<CharacterSelectionType>('selection')

    const changeType = (typeToChange: CharacterSelectionType) => {
        setType(typeToChange)
    }


    return {
        type,
        changeType
    }
}