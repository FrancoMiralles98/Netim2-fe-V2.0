import { useState } from "react"
import { Reinos } from "../../utils/character-selecition-utils";
import { NetimButton } from "../../../../shared/button/ButtomNetim";
import type { CharacterSelectionType } from "../../types/character-selection.type";
import { bonusFullNameByRef, type BonusRefKeys, type ReinosBuffType, type ReinosNames } from "netim2-shared";
import { NetimText } from "../../../../shared/typography/components/NetimText";
import { InfoTooltip } from "../../../../shared/tooltip/components/InfoToolTip";
import { BonusInfoToolTip } from "../../../../shared/tooltip/components/BonusInfoToolTip";

export const ReinoSelection = (
  { createCharacter,
    changeType,
    reinoBuff
  }: {
    createCharacter: (reino: ReinosNames) => void,
    changeType: (type: CharacterSelectionType) => void,
    reinoBuff: ReinosBuffType
  }
) => {
  const [selectedReino, setSelectedReino] = useState<ReinosNames | null>(null);

  const selectedReinoInfo = selectedReino
    ? Reinos[selectedReino]
    : null;


  const selectKingdom = (reino: ReinosNames) => {
    setSelectedReino(reino);
  };

  return (
    <section className="relative">
      <p className="text-center text-lg text-orange-500 mt-2">
        Seleccione el Reino
      </p>
      <div className="absolute left-10 top-0 z-20">
        <NetimButton onClickButtom={() => changeType("selection")} widthButtom="w-[70px]" text="Volver" />
      </div>
      <div className="flex justify-center gap-4">
        <div className="relative w-full max-w-[720px]">
          <img src="/characterSelection/kingdoms.png" className="block w-full select-none" alt="Mapa de reinos" />

          <button
            type="button"
            onClick={() => selectKingdom('chunjo')}
            className="
            absolute left-[5%] top-[8%]
            h-[38%] w-[33%]
            cursor-pointer-custom
            text-lg text-white
          "
          >
            Chunjo
          </button>

          <button
            type="button"
            onClick={() => selectKingdom('shinsoo')}
            className="
            absolute left-[10%] bottom-[7%]
            h-[34%] w-[60%]
            cursor-pointer-custom
            text-lg text-white    
          "
          >
            <p className="ml-12 mt-12">
              Shinsoo

            </p>
          </button>

          <button
            type="button"
            onClick={() => selectKingdom('jinno')}
            className="
            absolute right-[3%] top-[14%]
            h-[50%] w-[34%]
            cursor-pointer-custom
            text-lg text-white     
          "
          >

            Jinno

          </button>
        </div>

        <div className="max-w-[270px]  min-w-[290px] self-start p-1">

          {selectedReinoInfo && (
            <section
              id="info_kingdom"
              className="bg-[url('/characterSelection/bg-pj_2.png')] p-2"
            >
              <div className="grid grid-cols-2 items-center bg-black/30">
                <div
                  className={`
                h-[50px] w-[105px]
                bg-[url('/characterSelection/flags.jpg')]
                bg-cover
                ${selectedReinoInfo.flagClassName}
              `}
                />

                <h1 className={`text-[14px] ${selectedReinoInfo.colorNameClassName}`}>
                  Reino de {selectedReinoInfo.name}
                </h1>
              </div>

              <textarea
                className="mi-contenedor custom-scrollbar mt-3 h-[300px] w-full bg-black py-1 pl-1 text-white"
                readOnly
                value={selectedReinoInfo.description}
              />

              <NetimText cssAditionals="!text-red-300 !text-sm mt-1" text="*Importante: la elección del reino será aplicada a toda tu cuenta." />

              {
                selectedReino &&
                <div>
                  <div className="my-2 relative">
                    <div className="absolute right-11 bottom-1">
                      <InfoTooltip
                        title="Buffo de Reino"
                        message="Cada reino otorga buffos especiales a los personajes creados en él. Estos bonus representan la cultura y filosofía de cada reino. Según el reino que elijas, tus personajes recibirán distintos beneficios pasivos que pueden mejorar aspectos como combate y recompensas."
                        position="left"
                      />
                    </div>
                    <p className="text-center text-orange-300">Buffos de Reino</p>
                    <hr className="mx-auto border-amber-300 w-[70%]" />
                  </div>
                  {Object.entries(reinoBuff[selectedReino]).map(([bonus, value], index) => (
                    <div key={`buffReino ${index}`} className="flex gap-1 items-center mt-1">
                      <NetimText cssAditionals="!text-sm" text={`${bonusFullNameByRef(bonus as BonusRefKeys)} :`} />
                      <NetimText cssAditionals="!text-sm !text-emerald-200" text={`+${value.toString()}%`} />
                      <BonusInfoToolTip bonusRef={bonus as BonusRefKeys} />
                    </div>
                  ))}
                </div>
              }

              <div className="mt-3 flex justify-center">
                <NetimButton onClickButtom={() => { 
                  createCharacter(selectedReino!)
                  changeType('selection') 
                  }} text="Finalizar" />
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}