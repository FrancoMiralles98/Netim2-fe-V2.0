import { useState } from "react"
import type { CharacterSelectionType } from "../types/character-selection.type"
import { CharacterCreationCard } from "./creation/CharacterCreationCard"

export const Selection = ({ changeType }: { changeType: (typeToChange: CharacterSelectionType) => void }) => {
    const characters: number[] = [1, 2]
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
        <section>
            <i
                className="bi bi-arrow-left text-2xl text-orange-200 cursor-pointer-custom top-[55%] left-[30%] absolute z-20"
                onClick={passLeft}
            />

            <div className="mx-auto max-w-[500px] overflow-hidden">
                <section
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {characters.map((character, i) => (
                        <div key={i} className="min-w-full flex-shrink-0">
                            <CharacterCreationCard
                                isActive={i === currentSlide}
                            />
                        </div>
                    ))}
                </section>
            </div>

            <i
                className="bi bi-arrow-right text-2xl cursor-pointer-custom text-orange-200 top-[55%] right-[30%] absolute z-20"
                onClick={passRight}
            />
        </section>
    );
}