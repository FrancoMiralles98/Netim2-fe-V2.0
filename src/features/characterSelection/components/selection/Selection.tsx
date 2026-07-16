import type { CharacterSummary } from "netim2-shared"
import { NetimButton } from "../../../../shared/button/ButtomNetim"
import { useUserSession } from "../../../userSession/hook/useUserSession"
import type { CharacterSelectionType } from "../../types/character-selection.type"
import { CharacterSelectionCard } from "./CharacterSelectionCard"
import { useState } from "react"

export const Selection = ({
    changeType,
    characters }:
    {
        changeType: (typeToChange: CharacterSelectionType) => void,
        characters: CharacterSummary[]
    }) => {

    const { logout } = useUserSession()
    const [currentSlide, setCurrentSlide] = useState(0)

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

    return (
        <section className="">
            <div className="flex justify-center items-center">
                <img src="/landing/Netim2_2.png" className="relative mx-auto mt-10 z-10 w-60 h-30" alt="" />
            </div>
            <section className="relative mx-auto w-full max-w-[580px]">
                <div className="absolute left-[-10rem] top-7 z-20">
                    <NetimButton onClickButtom={() => changeType("creation")} widthButtom="w-[110px]" text="Crear Personaje" />
                </div>
                <div className="absolute left-[-10rem] top-15 z-20">
                    <NetimButton onClickButtom={logout} widthButtom="w-[70px]" text="Salir" />
                </div>
                <p className="text-center text-orange-500 font-semibold text-lg my-3">Seleccione tu personaje</p>
                <button
                    type="button"
                    onClick={passLeft}
                    className="
              absolute left-0 top-1/2 z-20
              -translate-y-1/2
              cursor-pointer-custom
              text-2xl text-orange-200
              hover:scale-110
            ">
                    <i className="bi bi-arrow-left" />
                </button>

                <div className="mx-auto max-w-[500px] overflow-hidden">
                    <section
                        className="flex transition-transform duration-500"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {characters.map((character, i) => (
                            <div key={`selection ${i}`} className="min-w-full flex-shrink-0">
                                <CharacterSelectionCard character={character} />
                            </div>
                        ))}
                    </section>
                </div>

                <button type="button" onClick={passRight} className="
              absolute right-0 top-1/2 z-20
              -translate-y-1/2
              cursor-pointer-custom
              text-2xl text-orange-200
              hover:scale-110">
                    <i className="bi bi-arrow-right" />
                </button>
            </section>
        </section>
    )
}