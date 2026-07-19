import { StatBar } from "../../../../../shared/bars/components/StatBar"
import { NetimButton } from "../../../../../shared/button/ButtomNetim"
import { NetimText } from "../../../../../shared/typography/components/NetimText"
import type { SelectionCardProps } from "../../../types/props/selection-card-props"
import { getIconRace, getNameRace } from "../../../utils/character-selecition-utils"

export const ChunjoCard = ({ character, getImageClass, handleConnectClick, handleDeleteClick, isActive, maxAttributeValue }: SelectionCardProps) => {
    return (
        <>
            {
                character &&
                <section className="text-red-950  pl-[1.5rem] pt-[6rem] w-[550px] h-[550px]  bg-[length:100%_100%] bg-[url('/modal/chunjo-character-modal.png')] bg-center bg-no-repeat">
                    <section className="grid relative  grid-cols-[45%_auto] mb-3 mt-3">
                        <div className="grid grid-cols-[30%_70%] justify-center items-center">
                            <img
                                src={getIconRace(character.raza, character.genero)}
                                className="bg-[url('/characterSelection/icons_perfil.png')] ml-4 self-center min-w-[41px] max-w-[41px] h-[40px] overflow-hidden bg-no-repeat bg-cover"
                                alt=""
                                style={{ backgroundPosition: `0px 0px` }}
                            />
                            <img
                                className="min-h-13 max-h-30 w-full"
                                src={getNameRace(character.raza)}
                                alt=""
                            />
                        </div>
                        <div className="">
                            <h1 className="text-center ">Especializacion</h1>
                            <hr className="mx-auto w-[70%]" />
                            <div className="flex justify-center mt-2 ">
                                {
                                    character.especialidad ?
                                        <>
                                            <img className={getImageClass(character.especialidad)} src={`/characterSelection/${character.especialidad ?? 'Mental'}.png`} alt="" />
                                        </>
                                        :
                                        <>
                                            <NetimText cssAditionals="!text-red-950 !font-medium" text="No aprendida" />
                                        </>
                                }
                            </div>
                        </div>
                    </section>
                    <div className="grid  mx-4 w-[90%] grid-cols-2">
                        <section className="grid  gap-y-3 justify-center">
                            <div className="grid  gap-y-1 items-center w-[160px]">
                                <NetimText cssAditionals="text-[14px] !text-red-950 !font-medium " text="Nombre" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={character.nombre} />
                            </div>
                            <div className="grid items-center mx-auto gap-y-1 w-[110px]">
                                <NetimText cssAditionals="text-[14px] !text-red-950 !font-medium " text="Lv" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={character.lv.toString()} />
                            </div>
                        </section>
                        <section className="grid gap-y-3 justify-center">
                            <div className="grid gap-y-1 items-center w-[160px]">
                                <NetimText cssAditionals=" text-[14px] !text-red-950 !font-medium " text="Gremio" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={character.gremio_options?.gremio_name ?? ''} />
                            </div>
                            <div className="grid items-center mx-auto gap-y-1 w-[110px]">
                                <NetimText cssAditionals="text-[14px] !text-red-950 !font-medium " text="Tiempo jugado" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={'0 m.'} />
                            </div>
                        </section>
                    </div>
                    <p className="text-center mr-5 font-medium">Stats</p>
                    <section className="w-[88%] ml-5 mx-auto">
                        <StatBar maxValue={maxAttributeValue} name="VIT" value={character.stats.atributos.VIT.bonusPoints + character.stats.atributos.VIT.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                        <StatBar maxValue={maxAttributeValue} name="STR" value={character.stats.atributos.STR.bonusPoints + character.stats.atributos.STR.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                        <StatBar maxValue={maxAttributeValue} name="INT" value={character.stats.atributos.INT.bonusPoints + character.stats.atributos.VIT.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                        <StatBar maxValue={maxAttributeValue} name="DEX" value={character.stats.atributos.DEX.bonusPoints + character.stats.atributos.DEX.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                    </section>
                    <div className="flex justify-center mt-5 mr-5 ">
                        <NetimButton onClickButtom={handleConnectClick} text="Jugar" />
                    </div>
                    <div className="flex justify-end mt-7 mr-11">
                        <NetimButton onClickButtom={handleDeleteClick} text="Eliminar" />
                    </div>
                </section>
            }

        </>
    )
}