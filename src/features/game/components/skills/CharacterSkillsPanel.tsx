import { useState } from "react";
import type { CharacterSession, ReinosNames } from "netim2-shared";
import { getCharacterSpecialityIconPath } from "../../../../shared/utils/get-character-speciality-icon-path";

interface CharacterSkillsPanelProps {
    reino: ReinosNames | null;
    raza: CharacterSession["raza"];
}

const WARRIOR_SPECIALIZATIONS = [
    { name: "Corporal", detail: "Velocidad y presión ofensiva.", icon: "Corporal" },
    { name: "Mental", detail: "Resistencia y golpes contundentes.", icon: "Mental" },
] as const;

const PLACEHOLDER_SPECIALIZATIONS = [
    { name: "Especialidad I", detail: "Descripción de la especialidad pendiente.", icon: null },
    { name: "Especialidad II", detail: "Descripción de la especialidad pendiente.", icon: null },
] as const;

export const CharacterSkillsPanel = ({ reino, raza }: CharacterSkillsPanelProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const specializations = raza === "guerrero" ? WARRIOR_SPECIALIZATIONS : PLACEHOLDER_SPECIALIZATIONS;
    const selected = specializations[selectedIndex];
    const showCorporalImage = raza === "guerrero" && selectedIndex === 0;

    return (
        <section
            aria-label="Habilidades del personaje"
            className="relative aspect-[4/3] w-[1100px] justify-self-center overflow-hidden bg-[length:100%_100%] bg-no-repeat font-metin text-[#f5e1b5]"
            style={{ backgroundImage: reino ? `url('/game/modal-${reino}-rectangular.png')` : undefined }}
        >
            {showCorporalImage && (
                <div
                    className="pointer-events-none absolute top-[2%] right-0 bottom-[25%] left-[35%] overflow-hidden"
                    style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)" }}
                >
                    <div
                        className="absolute inset-0"
                        style={{ maskImage: "radial-gradient(ellipse 35% 25% at 100% 0%, transparent 0%, black 100%)" }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{ maskImage: "radial-gradient(ellipse 75% 40% at 0% 100%, transparent 0%, transparent 50%, black 100%)" }}
                        >
                            <div
                                className="absolute top-0 left-0 h-[80%] w-full"
                                style={{ maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)" }}
                            >
                                <img
                                    src="/game/specialitySelection/img-guerrero-corporal.png"
                                    alt=""
                                    className="h-full w-full object-cover object-center"
                                    style={{ maskImage: "linear-gradient(to right, transparent 0%, black 18%, black 76%, transparent 100%)" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="absolute inset-x-[6%] top-[8%] bottom-[7%] z-10 grid grid-cols-[43%_1fr] gap-10">
                <div className="flex min-h-0 flex-col">
                    <header className="mb-8 pt-8 text-center">
                        <h1 className="text-[23px] font-semibold uppercase leading-tight">Elige tu especialidad</h1>
                    </header>

                    <div className="flex flex-col gap-3">
                        {specializations.map((specialization, index) => (
                            <button
                                key={specialization.name}
                                type="button"
                                aria-pressed={selectedIndex === index}
                                onClick={() => setSelectedIndex(index)}
                                className={`mx-auto flex min-h-[80px] w-[60%] cursor-pointer items-center gap-3 rounded-sm border bg-black/55 p-[10px] text-left transition-colors hover:bg-white/10 ${selectedIndex === index ? "border-amber-400" : "border-slate-500"}`}
                            >
                                <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center border border-amber-200/70 bg-black/60 text-center text-[10px] text-gray-300">
                                    {specialization.icon ? (
                                        <img
                                            src={getCharacterSpecialityIconPath(specialization.icon)}
                                            alt={`Icono de ${specialization.name}`}
                                            className="h-[44px] w-[44px] object-contain"
                                        />
                                    ) : (
                                        "Ícono"
                                    )}
                                </span>
                                <span className="text-[18px] leading-tight font-semibold">{specialization.name}</span>
                            </button>
                        ))}
                    </div>

                </div>

                <div className="flex min-h-0 flex-col pb-22">
                    <div className={`mb-5 flex min-h-[230px] flex-1 items-center justify-center text-[15px] text-gray-400 ${showCorporalImage ? "" : "border border-white/15 bg-black/20"}`}>
                        {!showCorporalImage && "Imagen de especialidad"}
                    </div>

                    <div>
                        <h2 className="text-[38px] font-semibold uppercase leading-none">{selected.name}</h2>
                        <hr className="my-3 border-amber-200/60" />
                        <p className="text-[19px] text-gray-200">{selected.detail}</p>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-4">
                            <hr className="flex-1 border-amber-200/50" />
                            <h3 className="text-[19px]">Habilidades</h3>
                            <hr className="flex-1 border-amber-200/50" />
                        </div>
                        <div className="mt-4 flex justify-between gap-3">
                            {Array.from({ length: 4 }, (_, index) => (
                                <div key={index} className="flex h-[78px] w-[78px] items-center justify-center border border-amber-200/70 bg-black/65 text-center text-[13px] text-gray-300">
                                    Ícono
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
