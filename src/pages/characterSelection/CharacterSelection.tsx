import { Creation } from "../../features/characterSelection/components/creation/Creation"
import { Selection } from "../../features/characterSelection/components/selection/Selection"
import { useCharacterSelection } from "../../features/characterSelection/hooks/useCharacterSelection"

export const CharacterSelection = () => {

    const { changeType, type, characterCreationConfig } = useCharacterSelection()

    return (
        <main className="relative h-[100dvh] w-full overflow-x-auto overflow-y-auto">
            <div className="fixed inset-0  bg-[url('/characterSelection/Fond2015.jpg')] bg-cover bg-[center_top] bg-no-repeat" />

            <div className="relative z-10 mx-auto min-h-[100dvh] w-full max-w-[1200px] px-4">

                {characterCreationConfig && (
                    <>
                        {type === 'selection' && (
                            <Selection characters={characterCreationConfig.characters} changeType={changeType} />
                        )}

                        {type === 'creation' && (
                            <Creation
                                characterCreationConfig={characterCreationConfig}
                                changeType={changeType}
                            />
                        )}
                    </>
                )}
            </div>
        </main>
    );
}