import type { CharacterSession } from "netim2-shared";

export const CharacterIdentity = ({ character }: { character: CharacterSession }) => (
    <div className="flex ml-[1rem]">
        <img
            src={`/game/${character.raza}-${character.genero}.png`}
            className="w-[10rem] self-center"
            alt={`${character.raza} ${character.genero}`}
        />
        <div className="grid grid-rows-[40%_14%_auto]">
            <h1 className="text-metin-gold self-end mb-[7px]">{character.nombre}</h1>
            <div id="nivel">
                <span className="ml-[5px] text-metin-label self-start ">Nivel:</span>
                <span className="text-metin-label ml-[0.5rem]">{character.lv}</span>
            </div>
            <div id="gremio">
                <span className="ml-[5px] text-metin-label self-start ">Gremio:</span>
                <span className="text-yellow-300 ml-[0.5rem]">[HOLA]</span>
            </div>
        </div>
    </div>
);
