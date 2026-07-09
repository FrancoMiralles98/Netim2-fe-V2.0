import { Creation } from "../../features/characterSelection/components/creation/Creation"
import { Selection } from "../../features/characterSelection/components/Selection"
import { useCharacterSelection } from "../../features/characterSelection/hooks/useCharacterSelection"

export const CharacterSelection = () => {

    const { changeType, type } = useCharacterSelection()

    return (
        <div className="min-w-[1200px] relative bg-[url('/characterSelection/Fond2015.jpg')] bg-[center_top_100%] bg-no-repeat bg-cover min-h-[100vh]">
            <div id='image' className="w-[250px] pt-7 mx-auto">
                <img src="/landing/Netim2_2.png" alt="" />
            </div>
            {
                type === 'selection' && <Selection changeType={changeType} />
            }
            {
                type === 'creation' && <Creation changeType={changeType} />
            }
        </div>
    )
}