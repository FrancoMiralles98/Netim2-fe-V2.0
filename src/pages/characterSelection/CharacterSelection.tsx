import { Creation } from "../../features/characterSelection/components/creation/Creation"
import { Selection } from "../../features/characterSelection/components/Selection"
import { useCharacterSelection } from "../../features/characterSelection/hooks/useCharacterSelection"

export const CharacterSelection = () => {

    const { changeType, type, characterCreationConfig } = useCharacterSelection()

    return (
        <main className="relative h-[100dvh] w-full overflow-x-auto overflow-y-auto">
            <div className="fixed inset-0  bg-[url('/characterSelection/Fond2015.jpg')] bg-cover bg-[center_top] bg-no-repeat" />

            <div className="relative z-10 mx-auto min-h-[100dvh] w-full max-w-[1200px] px-4">
                <div id="image" className="mx-auto w-[250px] pt-7">
                    <img src="/landing/Netim2_2.png" alt="Netim2" />
                </div>

                {characterCreationConfig && (
                    <>
                        {type === 'selection' && (
                            <Selection changeType={changeType} />
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