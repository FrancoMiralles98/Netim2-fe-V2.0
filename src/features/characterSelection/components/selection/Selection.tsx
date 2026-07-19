import { NetimButton } from "../../../../shared/button/ButtomNetim"
import { useUserSession } from "../../../userSession/hook/useUserSession"
import { CharacterSelectionCard } from "./CharacterSelectionCard"
import { useState } from "react"
import type { SelectionProps } from "../../types/props/selection-props"
import { useSelection } from "../../hooks/useSelection"
import { NetimText } from "../../../../shared/typography/components/NetimText"
import { BonusInfoToolTip } from "../../../../shared/tooltip/components/BonusInfoToolTip"
import { bonusFullNameByRef, type BonusRefKeys } from "netim2-shared"
import { Reinos } from "../../utils/character-selecition-utils"

export const Selection = ({
    changeType,
    characters,
    characterCreationConfig,
    deleteCharacter
}: SelectionProps) => {

    const { logout, user } = useUserSession()
    const [currentSlide, setCurrentSlide] = useState(0)
    const { handleDeleteCharacter, handleConnectCharacter } = useSelection(deleteCharacter)

    const passRight = () => {
        setCurrentSlide((prev) =>
            prev === characters.length - 1 ? 0 : prev + 1
        );
    };

    const passLeft = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? characters.length - 1 : prev - 1
        );
    };

    const reinoData = user?.reino ? Reinos[user.reino] : null;


    return (
        <section className="relative w-[1200px]">
            <div className="flex justify-center items-center">
                <img src="/landing/Netim2_2.png" className="relative mx-auto mt-10 z-10 w-60 h-30" alt="" />
            </div>
            <section className="absolute right-0" id='buff-reino'>
                {
                    characterCreationConfig && reinoData &&
                    <div className={`h-[180px] w-[320px] p-2  bg-[url('/modal/moda-reino.png')] bg-repeat bg-cover bg-center`}>
                        <p className="text-center pt-5 text-white">Buffos del Reino de</p>
                        <p className={`text-center ${reinoData.colorNameClassName}`}>{reinoData.name}</p>
                        <hr className={`text-white my-1 mx-auto w-[75%]`} />
                        <div className="mb-3 ml-4 grid justify-center items-center">
                            {Object.entries(characterCreationConfig.reinoBuff[reinoData.id]).map(([bonus, value], index) => (
                                <div key={`buffReino ${index}`} className="flex gap-1 items-center mt-1">
                                    <NetimText cssAditionals="!text-sm" text={`${bonusFullNameByRef(bonus as BonusRefKeys)} :`} />
                                    <NetimText cssAditionals="!text-sm !text-emerald-200" text={`+${value.toString()}%`} />
                                    <BonusInfoToolTip bonusRef={bonus as BonusRefKeys} />
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </section>
            <section className="relative mx-auto w-full max-w-[580px]">
                <div className="absolute left-[-10rem] top-7 z-20">
                    <NetimButton onClickButtom={() => changeType("creation")} widthButtom="w-[110px]" text="Crear Personaje" />
                </div>
                <div className="absolute left-[-10rem] top-15 z-20">
                    <NetimButton onClickButtom={logout} widthButtom="w-[70px]" text="Salir" />
                </div>
                <p className="text-center text-orange-500 font-semibold text-lg my-3">Seleccione tu personaje</p>
                {
                    characters && characters.length > 0 &&
                    <>
                        <button
                            type="button"
                            onClick={passLeft}
                            className="
              absolute left-[-1rem] top-1/2 z-20
              -translate-y-1/2
              cursor-pointer-custom
              text-2xl text-orange-200
              hover:scale-110
            ">
                            <i className="bi bi-arrow-left" />
                        </button>
                        <div className="mx-auto max-w-[550px] overflow-hidden">
                            <section
                                className="flex transition-transform duration-500"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {characters.map((character, i) => (
                                    <div key={`selection ${i}`} className="min-w-full flex-shrink-0">
                                        <CharacterSelectionCard
                                            isActive={i === currentSlide}
                                            character={character}
                                            maxAttributeValue={characterCreationConfig.attributeLimit}
                                            handleDeleteCharacter={handleDeleteCharacter}
                                            handleConnectCharacter={handleConnectCharacter}
                                        />
                                    </div>
                                ))}
                            </section>
                        </div>
                        <button type="button" onClick={passRight} className="
              absolute right-[-1rem] top-1/2 z-20
              -translate-y-1/2
              cursor-pointer-custom
              text-2xl text-orange-200
              hover:scale-110">
                            <i className="bi bi-arrow-right" />
                        </button>

                    </>
                }
            </section>
        </section>
    )
}