import { useCreation } from "../../hooks/useCreation"
import { CharacterCreation } from "./CharacterCreation"
import { ReinoSelection } from "./ReinoSelection"
import type { CreationProps } from "../../types/props/creation-props"

export const Creation = ({ addCharacter, changeType, characterCreationConfig }: CreationProps) => {

    const { createCharacterAfterReinoSeleciton,
        creationInstance,
        newAccount,
        handleCreateCharacter,
     } = useCreation({ addCharacter })

    return (
        <div>
            {
                creationInstance === 'select_reino' &&
                characterCreationConfig &&
                newAccount &&
                <>
                    <ReinoSelection
                        reinoBuff={characterCreationConfig.reinoBuff}
                        createCharacter={createCharacterAfterReinoSeleciton}
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
                        newAccount={newAccount}

                    />
                </>
            }

        </div>
    )
}