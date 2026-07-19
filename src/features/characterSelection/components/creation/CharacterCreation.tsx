import { useState } from "react";
import { CharacterCreationCard } from "./CharacterCreationCard"
import { NetimButton } from "../../../../shared/button/ButtomNetim";
import type { CharacterRace } from "netim2-shared";
import type { CharacterCreationProps } from "../../types/props/character-creation-props";

export const CharacterCreation = (
    { changeType,
        handleCreateCharacter,
        races,
        attributeLimit,
        newAccount
    }: CharacterCreationProps

) => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const passRight = () => {
        setCurrentSlide((prev) =>
            prev === races.length - 1 ? 0 : prev + 1
        );
    };

    const passLeft = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? races.length - 1 : prev - 1
        );
    };

    //Se hace esta funcion ya que si ya tiene un reino no pasara al componente de seleccion de reinos, entonces
    //al crear el personaje volvera al componente de seleccion de personajes
    const handleSelection = async (characterName: string, genero: 'femenino' | 'masculino', raza: CharacterRace) => {
        if (newAccount) {
            handleCreateCharacter(characterName, genero, raza)
        } else {
            const success = await handleCreateCharacter(characterName, genero, raza)
            if (success) {
                changeType('selection')
            }
        }
    }

    return (
        <section className="relative mx-auto w-full max-w-[580px]">
            <div className="absolute left-[-10rem] top-15 z-20">
                <NetimButton onClickButtom={() => changeType("selection")} widthButtom="w-[70px]" text="Volver" />
            </div>
            <p className="text-center text-orange-500 font-semibold text-lg my-3">Crea tu personaje</p>
            <button
                type="button"
                onClick={passLeft}
                className="
      absolute -left-8 top-1/2 z-20
      -translate-y-1/2
      cursor-pointer-custom
      text-2xl text-orange-200
      hover:scale-110
    ">
                <i className="bi bi-arrow-left" />
            </button>

            <div className="mx-auto max-w-[580px] overflow-hidden">
                <section
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {races.map((race, i) => (
                        <div key={i} className="min-w-full flex-shrink-0">
                            <CharacterCreationCard
                                handleCreateCharacter={handleSelection}
                                isActive={i === currentSlide}
                                raceInfo={race}
                                attributeLimit={attributeLimit}
                            />
                        </div>
                    ))}
                </section>
            </div>

            <button type="button" onClick={passRight} className="
      absolute -right-8 top-1/2 z-20
      -translate-y-1/2
      cursor-pointer-custom
      text-2xl text-orange-200
      hover:scale-110">
                <i className="bi bi-arrow-right" />
            </button>
        </section>
    );
}