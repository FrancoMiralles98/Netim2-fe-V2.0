import type { CharacterSpeciality } from "netim2-shared"
import { getBackGroundColor, getIconRace, getNameRace } from "../../utils/character-selecition-utils"
import { StatBar } from "../../../../shared/bars/components/StatBar"
import { NetimText } from "../../../../shared/typography/components/NetimText"
import { NetimButton } from "../../../../shared/button/ButtomNetim"
import type { CharacterSelectionCardProps } from "../../types/props/character-selection-card-props"
import { useModal } from "../../../../shared/modal/hooks/useModal"

export const CharacterSelectionCard = ({ character, isActive, maxAttributeValue, handleDeleteCharacter }: CharacterSelectionCardProps) => {

    const modal = useModal()

    const getImageClass = (type?: CharacterSpeciality) => {
        const isSelected = true

        return `
      justify-self-center cursor-pointer-custom transition-all duration-300
      ${isSelected
                ? `scale-110 brightness-110 ${getBackGroundColor(type ? type : 'base')} `
                : 'brightness-50 opacity-95 grayscale hover:brightness-90 hover:opacity-80 hover:grayscale-0'
            }`;
    };

    const handleClick = () => {
        modal.showActionModal({
            acceptText: 'Eliminar',
            title: 'Eliminar Personaje',
            subTitle: `Estas seguro que quieres eliminar a tu personaje: ${character.nombre} ?`,
            cancelText: 'Cancelar',
            onAccept: () => { handleDeleteCharacter(character) }
        })
    }

    return (
        <>
            {
                character &&
                <section className="text-orange-200 mb-[3rem]  p-2 bg-[url('/characterSelection/bg-pj_2.png')] bg-repeat bg-center border border-black w-[500px]">
                    <section className="grid relative grid-cols-[45%_auto] mb-5">
                        <div className="grid grid-cols-[30%_70%] justify-center items-center">
                            <img
                                src={getIconRace(character.raza, character.genero)}
                                className="bg-[url('/characterSelection/icons_perfil.png')] ml-2 self-center min-w-[41px] max-w-[41px] h-[40px] overflow-hidden bg-no-repeat bg-cover"
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
                            <h1 className="text-center">Especializacion</h1>
                            <hr className="mx-auto w-[70%]" />
                            <div className="flex justify-center mt-2">
                                {
                                    character.especialidad ?
                                        <>
                                            <img className={getImageClass(character.especialidad)} src={`/characterSelection/${character.especialidad ?? 'Mental'}.png`} alt="" />
                                        </>
                                        :
                                        <>
                                            <NetimText text="No aprendida" />
                                        </>
                                }
                            </div>
                        </div>
                    </section>
                    <div className="grid grid-cols-2">
                        <section className="grid gap-y-3 justify-center">
                            <div className="grid  gap-y-1 items-center w-[160px]">
                                <NetimText cssAditionals="text-[14px]" text="Nombre" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={character.nombre} />
                            </div>
                            <div className="grid items-center mx-auto gap-y-1 w-[100px]">
                                <NetimText cssAditionals="text-[14px]" text="Lv" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={character.lv.toString()} />
                            </div>
                        </section>
                        <section className="grid gap-y-3 justify-center">
                            <div className="grid gap-y-1 items-center w-[160px]">
                                <NetimText cssAditionals=" text-[14px]" text="Gremio" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={character.gremio_options?.gremio_name ?? ''} />
                            </div>
                            <div className="grid items-center mx-auto gap-y-1 w-[100px]">
                                <NetimText cssAditionals="text-[14px]" text="Tiempo jugado" />
                                <NetimText cssAditionals="!text-orange-200 border border-orange-200/30 flex items-center justify-center bg-black h-6" text={'0 m.'} />
                            </div>
                        </section>
                    </div>
                    <p className="text-center mt-3">Stats</p>
                    <section className="w-[95%] mx-auto">
                        <StatBar maxValue={maxAttributeValue} name="VIT" value={character.stats.atributos.VIT.bonusPoints + character.stats.atributos.VIT.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                        <StatBar maxValue={maxAttributeValue} name="STR" value={character.stats.atributos.STR.bonusPoints + character.stats.atributos.STR.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                        <StatBar maxValue={maxAttributeValue} name="INT" value={character.stats.atributos.INT.bonusPoints + character.stats.atributos.VIT.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                        <StatBar maxValue={maxAttributeValue} name="DEX" value={character.stats.atributos.DEX.bonusPoints + character.stats.atributos.DEX.lvPoints} isActive={isActive} animationKey={character.especialidad} />
                    </section>
                    <div className="flex justify-center gap-5 mt-8 ">
                        <NetimButton onClickButtom={() => { }} text="Jugar" />
                    </div>
                    <div className="flex justify-end">
                        <NetimButton onClickButtom={handleClick} text="Eliminar" />
                    </div>
                </section>
            }

        </>
    )
}