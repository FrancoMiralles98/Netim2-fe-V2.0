import { StatBar } from "../../../../shared/bars/components/StatBar"
import { NetimText } from "../../../../shared/typography/components/NetimText"

export const CharacterCreationCard = ({ isActive }: { isActive: boolean }) => {
    return (
        <section className="text-orange-200 p-2 bg-[url('/characterSelection/bg-pj_2.png')]  border border-black w-[500px] bg-white/40">
            <section className="grid grid-cols-[30%_70%]">
                <div className="flex items-center">
                    <img src='' className="bg-[url('/characterSelection/icons_perfil.png')] self-center min-w-[41px] max-w-[41px] h-[40px]  overflow-hidden bg-no-repeat bg-cover" alt="" style={{ backgroundPosition: `0px 0px` }} />
                    <h1 className="text-center text-2xl pl-3">Sura</h1>
                </div>

                <div>
                    <h1 className="text-center">Especializaciones</h1>
                    <hr className="mx-auto w-[70%]" />
                    <NetimText text="Seleccione un icono para mas información" cssAditionals="italic pt-1 pb-3"/>
                    <section className="grid grid-cols-2">
                        <div className="grid justify-center items-center">
                            <img src={`${'/characterSelection/Espejo.png'}`} className="justify-self-center" alt="" />

                        </div>
                        <div className="grid justify-center items-center">
                            <img src={`${'/characterSelection/MagiaNegra.jpg'}`} className="justify-self-center" alt="" />

                        </div>
                    </section>
                </div>
            </section>
            <div className="flex justify-center mt-5">
                <h1 className="text-center pr-2">Max Stats: </h1>
                <h1>Magia Negra</h1>
            </div>
            <StatBar name="VIT" value={40} isActive={isActive} />
            <StatBar name="INT" value={49} isActive={isActive} />
            <StatBar name="STR" value={49} isActive={isActive} />
            <StatBar name="DEX" value={62} isActive={isActive} />
            <div className="mt-3">
                <h1>Historia</h1>
                <hr className="w-[50%]"/>
                <div  className="w-[100%] bg-black text-white mx-auto px-2 py-1 overflow-y-auto text-sm my-3 custom-scrollbar h-[100px] min-h-[100px] max-h-[100px]" >
                    "Los Sura son luchadores que obtuvieron poderes mágicos al hacer un pacto con el diablo. La magia que controlan ahora les permite herir a sus enemimgos desde la distancia, mientras que su habilidad de espada les hace excelentes combatientes cuerpo a cuerpo. Al especializarse, los Suras pueden elegir entre mejorar sus hechizos de ataque o desarrollar conjuros fortalecedores."
                </div>
            </div>
        </section>
    )
}