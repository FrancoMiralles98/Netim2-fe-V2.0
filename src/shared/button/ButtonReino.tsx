import type { ReinosNames } from "../types/backend/gameData/reinos.types";

interface ButtonReinoProps {
    reino: ReinosNames;
    texto?: string;
}

const HOVER_CLASS_NAME_BY_REINO = {
    shinsoo: "hover:brightness-125 hover:saturate-120 hover:contrast-110",
    jinno: "hover:brightness-130 hover:saturate-135 hover:contrast-105",
    chunjo: "hover:brightness-105 hover:saturate-110 hover:contrast-105",
} satisfies Record<ReinosNames, string>;

export const ButtonReino = ({ reino, texto }: ButtonReinoProps) => {

    const CssForReino: Record<ReinosNames, string> = {
        chunjo: ' text-[#fff0c7] font-medium [text-shadow:0_1px_0_#5a2608,1px_0_0_#5a2608,-1px_0_0_#5a2608,0_-1px_0_#5a2608,0_2px_2px_rgba(0,0,0,0.7)]',
        jinno: 'text-transparent font-semibold',
        shinsoo: 'text-transparent font-semibold'
    }

    return (
        <div className="relative inline-block">
            <img
                className={`transition-all w-[20rem] h-[30px] duration-200 ${HOVER_CLASS_NAME_BY_REINO[reino]}`}
                src={`/button/boton-${reino}.png`}
                alt={`Botón del reino ${reino}`}
            />
            {texto &&
                (
                    <span className={`
                pointer-events-none 
                text-[14px] 
                absolute 
                inset-0 
                flex 
                items-center 
                justify-center 
                text-center 
                 font-metin
                tracking-wide
            bg-gradient-to-b
            from-[#fff1c7]
        via-[#e9d19a]
        to-[#b58a4d]
        bg-clip-text
        [filter:drop-shadow(0_2px_1px_#000)_drop-shadow(0_0_2px_rgba(255,220,150,0.45))]
        ${CssForReino[reino]}
                `}>
                        {texto}
                    </span>
                )}
        </div>
    );
};
