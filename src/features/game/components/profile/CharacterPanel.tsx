import type { CharacterSession } from "netim2-shared";
import { BonusPanel } from "./BonusPanel";
import { CharacterInventoryPanel } from "./CharacterInventoryPanel";
import { CharacterEquipmentPanel } from "../../../equip/components/CharacterEquipmentPanel";
import { CharacterIdentity } from "./CharacterIdentity";
import { GeneralStatsPanel } from "./GeneralStatsPanel";
import { StatCircle } from "./StatCircle";

interface CharacterPanelProps {
    character: CharacterSession;
}

export const CharacterPanel = ({ character }: CharacterPanelProps) => {
    return (
        <div
            className="relative grid grid-rows-[26%_36%_38%] grid-cols-1 aspect-[4/3] w-[1100px] justify-self-center bg-[length:100%_100%] bg-no-repeat"
            style={{ backgroundImage: character.reino ? `url('/game/modal-${character.reino}-rectangular.png')` : undefined }}
        >
            <div
                id='info-character-stats'
                className="mx-[3.9%] mt-[3%] min-h-0 grid grid-cols-[44%_auto] "
            >
                <CharacterIdentity character={character} />
                <div className="flex min-h-0 flex-col ">
                    <h1 className="text-metin-label text-[18px]! mt-[2rem] text-center">Atributos</h1>
                    <img src="/game/hr-custom.png" className="w-[95%] mx-auto" alt="" />
                    <div className="flex min-h-0 gap-10 flex-1 justify-center b items-center">
                        <StatCircle stat="VIT" byLevel={character.atributos.VIT.lvPoints} byBonifications={character.atributos.VIT.bonusPoints} />
                        <StatCircle stat="STR" byLevel={character.atributos.STR.lvPoints} byBonifications={character.atributos.STR.bonusPoints} />
                        <StatCircle stat="INT" byLevel={character.atributos.INT.lvPoints} byBonifications={character.atributos.INT.bonusPoints} />
                        <StatCircle stat="DEX" byLevel={character.atributos.DEX.lvPoints} byBonifications={character.atributos.DEX.bonusPoints} />
                    </div>
                    <div className="h-[30px]">
                        <p className="text-metin-label text-center">
                            Puntos de atributos disponibles: {character.puntos_atributos}
                        </p>
                    </div>
                </div>
            </div>
            <div id='equipo-stats' className="mx-[3.9%] flex items-center font-sans">
                <CharacterEquipmentPanel equipo={character[`equipo_${character.equipo_selected}`]} character={character} />
                <GeneralStatsPanel character={character} />
                <BonusPanel character={character} />
            </div>
            <div id='inventario' className="mx-[3.9%] mb-[4.5%] min-h-0">
                <CharacterInventoryPanel character={character} />
            </div>
        </div>
    );
};
