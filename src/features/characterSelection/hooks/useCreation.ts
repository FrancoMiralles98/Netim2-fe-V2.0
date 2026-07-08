import { useState } from "react"

export const useCreation = () => {
    const [creationInstance, setCreationInstance] = useState<'select_raza' | 'select_reino'>('select_raza')

    const changeInstance = (instance: 'select_raza' | 'select_reino') => {
        setCreationInstance(instance)
    }

    return {
        creationInstance,
        changeInstance
    }
}