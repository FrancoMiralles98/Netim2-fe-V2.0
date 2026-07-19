import { useContext } from "react"
import { CharacterSessionContext } from "../context/character-session.context"

export const useCharacterSession = () => {
    const context = useContext(CharacterSessionContext)

    if (!context) {
        throw new Error('No se pudo obtener el context de character')
    }

    return context
}