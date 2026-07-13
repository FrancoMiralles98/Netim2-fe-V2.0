import { useState } from "react"
import { Reinos } from "../../utils/character-selecition-utils";
import { NetimButton } from "../../../../shared/button/ButtomNetim";
import type { CharacterSelectionType } from "../../types/character-selection.type";
import type { ReinosNames } from "netim2-shared";

export const ReinoSelection = (
  { changeInstance,
    changeType
  }: {
    changeInstance: (prop: 'select_raza' | 'select_reino') => void,
    changeType: (type: CharacterSelectionType) => void
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
      <p className="text-center text-lg text-orange-500">
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

        <div className="max-w-[250px] self-center p-1">

          {selectedReinoInfo && (
            <section
              id="info_kingdom"
              className={`  ${selectedReinoInfo.bgClassName}`}
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

              <p className="text-[13px] font-medium text-white">
                *La elección del reino es solo para el personaje creado, no para la cuenta.
              </p>

              <div className="mt-3 flex justify-center">
                <NetimButton onClickButtom={() => changeInstance('select_raza')} text="siguiente" />
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}