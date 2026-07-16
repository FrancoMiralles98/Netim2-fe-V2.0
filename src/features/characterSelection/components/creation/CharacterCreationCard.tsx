import { StatBar } from "../../../../shared/bars/components/StatBar"
import { NetimText } from "../../../../shared/typography/components/NetimText"
import { getExplicationByRaceSelected, getHistoriaByRace, getIconRace, getNameRace } from "../../utils/character-selecition-utils";
import { NetimButton } from "../../../../shared/button/ButtomNetim";
import { InfoTooltip } from "../../../../shared/tooltip/components/InfoToolTip";
import { SpecialityEffectIcons } from "./SpecialityEffectIcons";
import { useCharacterCreationCard } from "../../hooks/useCharacterCreationCard";
import type { CharacterRace, RaceInfo } from "netim2-shared";
import { SpecialityAuraEffectIcons } from "./SpecialityAuraEffectIcon";

export const CharacterCreationCard = (
    { isActive, raceInfo, attributeLimit, handleCreateCharacter }:
        {
            isActive: boolean,
            raceInfo: RaceInfo,
            attributeLimit: number,
            handleCreateCharacter: (nombre: string, genero: 'femenino' | 'masculino', raza: CharacterRace) => void
        }) => {

    const {
        genero,
        changeGenero,
        selectedSpeciality,
        setSelectedSpeciality,
        speciality1,
        speciality2,
        selectedStats,
        mainDamageInfo,
        getImageClass,
        changeName,
        characterName
    } = useCharacterCreationCard(raceInfo);

    return (
        <section className="text-orange-200 mb-[3rem]  p-2 bg-[url('/characterSelection/bg-pj_2.png')] bg-repeat bg-center border border-black w-[500px]">
            {
                raceInfo &&
                <>
                    <section className="grid relative grid-cols-[45%_auto]">
                        <div className="absolute top-20 w-44 h-10">
                            <NetimText text="Elige el genero:" />
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <NetimButton text="Masculino" onClickButtom={() => changeGenero('masculino')} />
                                <NetimButton text="Femenino" onClickButtom={() => changeGenero('femenino')} />

                            </div>
                        </div>
                        <div className="grid grid-cols-[30%_70%] items-center">
                            <img
                                src={getIconRace(raceInfo.raza, genero)}
                                className="bg-[url('/characterSelection/icons_perfil.png')] ml-2 self-center min-w-[41px] max-w-[41px] h-[40px] overflow-hidden bg-no-repeat bg-cover"
                                alt=""
                                style={{ backgroundPosition: `0px 0px` }}
                            />
                            <img
                                className="min-h-13 max-h-30 w-full"
                                src={getNameRace(raceInfo.raza)}
                                alt=""
                            />

                        </div>

                        <div className="">
                            <h1 className="text-center">Especializaciones</h1>
                            <hr className="mx-auto w-[70%]" />

                            <NetimText
                                text="Seleccione un icono para mas información"
                                cssAditionals="italic pt-1 pb-3"
                            />

                            <section className="grid grid-cols-3">
                                {speciality1 && speciality2 && (
                                    <>
                                        <div className="grid justify-center items-center">
                                            <img
                                                id="especialidad-1"
                                                onClick={() => setSelectedSpeciality(speciality1)}
                                                src={`/characterSelection/${speciality1}.png`}
                                                className={getImageClass(speciality1)}
                                                alt={speciality1}
                                            />
                                        </div>

                                        <div className="flex gap-5 justify-center items-center">
                                            <img
                                                src="/characterSelection/doble-flecha-i.png"
                                                onClick={() => setSelectedSpeciality(speciality1)}
                                                alt=""
                                                className="cursor-pointer-custom"
                                            />

                                            <img
                                                id="base"
                                                src="/characterSelection/character-base.png"
                                                onClick={() => setSelectedSpeciality('base')}
                                                className={getImageClass('base')}
                                                alt="base"
                                            />

                                            <img
                                                src="/characterSelection/doble-flecha.d.png"
                                                onClick={() => setSelectedSpeciality(speciality2)}
                                                alt=""
                                                className="cursor-pointer-custom"
                                            />
                                        </div>

                                        <div className="grid justify-center items-center">
                                            <img
                                                id="especialidad-2"
                                                onClick={() => setSelectedSpeciality(speciality2)}
                                                src={`/characterSelection/${speciality2}.png`}
                                                className={getImageClass(speciality2)}
                                                alt={speciality2}
                                            />
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>
                    </section>

                    <div>
                        <NetimText cssAditionals="text-start mt-12 my-2" text={getExplicationByRaceSelected(raceInfo.raza)} />
                        <p></p>
                    </div>
                    <div className="flex justify-center items-center">
                        <h1 className="text-center pr-2">Max Stats:</h1>
                        <h1 className="mr-2">
                            {selectedSpeciality === 'base'
                                ? 'Sin Especialidad'
                                : selectedSpeciality}
                        </h1>
                        <InfoTooltip
                            title="Max Stats"
                            message="Las barras muestran el límite máximo de puntos que puede alcanzar cada stat según la raza y la especialidad seleccionada. 
Estos límites aplican únicamente a los puntos que obtenés al progresar en cada nivel y que podés distribuir manualmente en tus stats.
Aunque una raza o especialidad tenga un cap determinado, ese límite puede superarse mediante bonus de items, equipamiento u otros efectos especiales, hasta un máximo total de 200 puntos por stat."
                            position="bottom" />
                    </div>


                    {selectedStats && (
                        <section>
                            <StatBar maxValue={attributeLimit} name="VIT" value={selectedStats.VIT} isActive={isActive} animationKey={selectedSpeciality} />
                            <StatBar maxValue={attributeLimit} name="STR" value={selectedStats.STR} isActive={isActive} animationKey={selectedSpeciality} />
                            <StatBar maxValue={attributeLimit} name="INT" value={selectedStats.INT} isActive={isActive} animationKey={selectedSpeciality} />
                            <StatBar maxValue={attributeLimit} name="DEX" value={selectedStats.DEX} isActive={isActive} animationKey={selectedSpeciality} />
                        </section>
                    )}
                    <div className="flex gap-3">
                        <NetimText cssAditionals="text-start mt-3" text="Principal tipo de daño:" />
                        <NetimText cssAditionals={`text-start mt-3 ${mainDamageInfo.textClassName}`} text={mainDamageInfo.label} />
                    </div>

                    <div className="grid grid-cols-2">
                        {
                            selectedSpeciality !== 'base' &&
                            <div>
                                <p className="mt-3 text-center">Efectos de sus skills de daño </p>
                                <div className="flex justify-center min-h-9 gap-3 mt-2 mb-3">
                                    <SpecialityEffectIcons selectedSpeciality={selectedSpeciality} />
                                </div>
                            </div>
                        }
                        {
                            selectedSpeciality !== 'base' &&
                            <div>
                                <p className="mt-3 text-center">Efectos de sus Auras </p>
                                <div className="flex justify-center min-h-9 gap-3 mt-2 mb-3">
                                    <SpecialityAuraEffectIcons selectedSpeciality={selectedSpeciality} />
                                </div>
                            </div>
                        }
                    </div>

                    <div className="mt-3">
                        <h1>Historia</h1>
                        <hr className="w-[50%]" />

                        <div className="w-full bg-black text-white mx-auto px-2 py-1 overflow-y-auto text-sm  custom-scrollbar h-[100px] min-h-[100px] max-h-[100px]">
                            {getHistoriaByRace(raceInfo.raza)}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="mt-3 text-center">Ingrese un nombre para su personaje: </h1>
                        <hr className="w-[75%] my-1 self-center" />
                        <input
                            autoComplete="off"
                            type="text"
                            className="w-[50%] self-center bg-black my-3 text-white border border-white text-center text-sm"
                            name="nombre"
                            value={characterName}
                            onChange={(event) => changeName(event.target.value)}
                        />
                        <div className="flex justify-center mt-3">
                            <button type="submit">
                                <NetimButton onClickButtom={() => handleCreateCharacter(characterName, genero, raceInfo.raza)} text="Crear" />
                            </button>
                        </div>
                    </div>
                </>

            }
        </section>
    );
}