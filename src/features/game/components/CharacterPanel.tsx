import type { CharacterSession } from "netim2-shared";
import { StatCircle } from "./StatCircle";
import { BonusPanel } from "./BonusPanel";
import { Inventory } from "./Inventory";

interface CharacterPanelProps {
    character: CharacterSession;
}

interface GeneralStatRowProps {
    icon?: string;
    iconTint?: keyof typeof ICON_TINT_CLASS;
    label: string;
    value: string | number;
    progress?: number;
    progressColor?: 'hp' | 'mana';
}

const ICON_TINT_CLASS = {
    health: 'bg-red-700',
    mana: 'bg-cyan-500',
    healthRegen: 'bg-green-600',
    manaRegen: 'bg-sky-500',
    physicalDamage: 'bg-orange-400',
    magicalDamage: 'bg-blue-400',
} as const;

const GeneralStatRow = ({ icon, iconTint, label, value, progress, progressColor = 'hp' }: GeneralStatRowProps) => (
    <div className={`grid min-h-0 items-center gap-2 border-b border-white/15 text-[11px] text-[#d5d6d2] last:border-b-0 ${progress !== undefined ? 'grid-cols-[18px_36px_minmax(0,1fr)_96px]' : 'grid-cols-[18px_minmax(0,1fr)_auto]'}`}>
        {icon ? (
            iconTint ? (
                <span
                    aria-hidden="true"
                    className={`block h-[16px] w-[18px] ${ICON_TINT_CLASS[iconTint]}`}
                    style={{
                        mask: `url("${icon}") center / contain no-repeat`,
                        WebkitMask: `url("${icon}") center / contain no-repeat`,
                    }}
                />
            ) : <img src={icon} className="max-h-[16px] max-w-[18px] object-contain" alt="" />
        ) : <span />}
        <div className={progress !== undefined ? 'contents' : 'flex min-w-0 items-center'}>
            <span className="truncate">{label}</span>
            {progress !== undefined && (
                <span className="h-[7px] min-w-0 border border-[#5b6568] bg-[#1c2529] p-px">
                    <span
                        className={`block h-full bg-gradient-to-r ${progressColor === 'mana' ? 'from-[#1763a9] to-[#42a5e8]' : 'from-[#98262b] to-[#d43a3d]'}`}
                        style={{ width: `${progress}%` }}
                    />
                </span>
            )}
        </div>
        <span className="whitespace-nowrap text-right tabular-nums text-white">{value}</span>
    </div>
);

export const CharacterPanel = ({ character }: CharacterPanelProps) => {
    const hpPercentage = character.stats.general.hp.max > 0
        ? Math.min(100, Math.max(0, character.stats.general.hp.actual / character.stats.general.hp.max * 100))
        : 0;

    const manaPercentage = character.stats.general.mana.max > 0
        ? Math.min(100, Math.max(0, character.stats.general.mana.actual / character.stats.general.mana.max * 100))
        : 0;

    return (
        <div
            className="relative grid grid-rows-[26%_36%_38%] grid-cols-1 mt-[2rem] aspect-[4/3] w-[1100px] justify-self-center bg-[length:100%_100%] bg-no-repeat"
            style={{ backgroundImage: character.reino ? `url('/game/modal-${character.reino}-rectangular.png')` : undefined }}
        >
            <div
                id='info-character-stats'
                className="mx-[3.9%] mt-[3%] min-h-0 grid grid-cols-[44%_auto] "
            >
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
                <div id="equipo" className="flex aspect-[9/14] w-[19%] shrink-0 flex-col bg-[url('/game/marco-equipo.png')] bg-[length:100%_100%] bg-no-repeat px-2">
                    <p className="flex h-[9%] pt-1 shrink-0 items-center b justify-center text-[12px] font-semibold text-[#e9cf99]">Equipo</p>
                    <div className="min-h-0 flex-1 overflow-hidden">
                        <img src="/game/equipo.png" className="mx-auto w-[90%]" alt="" />
                    </div>
                    <div className="flex h-[12%] pt-1 shrink-0 items-start justify-center gap-1 border-t border-[#8e683b]/70">
                        <img src="/game/bottom_equipo1.png" className="w-[30%]" alt="" />
                        <img src="/game/bottom_equipo2.png" className="w-[30%]" alt="" />
                        <img src="/game/bottom_equipo3.png" className="w-[30%]" alt="" />
                    </div>
                </div>
                <div id="stats-generales" className="h-full px-1 w-[30%] shrink-0 bg-[url('/game/marco-stats.png')] bg-[length:100%_100%] bg-no-repeat">
                    <div className="flex h-[13%] items-center justify-center px-4 text-[12px] font-semibold text-[#e9cf99]">
                        Estadísticas generales
                    </div>
                    <div className="grid h-[87%] grid-rows-10 px-4 pt-1 pb-3">
                        <GeneralStatRow icon="/fight/healt-icon1.png" iconTint="health" label="Vida" value={`${character.stats.general.hp.actual} / ${character.stats.general.hp.max}`} progress={hpPercentage} />
                        <GeneralStatRow icon="/fight/mana-icon1.png" iconTint="mana" label="Maná" value={`${character.stats.general.mana.actual} / ${character.stats.general.mana.max}`} progress={manaPercentage} progressColor="mana" />
                        <GeneralStatRow icon="/game/regen-vida.png" iconTint="healthRegen" label="Regeneración de vida" value={character.stats.general.regen_hp} />
                        <GeneralStatRow icon="/game/regen-mana.png" iconTint="manaRegen" label="Regeneración de maná" value={character.stats.general.regen_mana} />
                        <GeneralStatRow icon="/fight/icono-ad.png" iconTint="physicalDamage" label="Valor de Ataque" value={`${character.stats.general.ad.min} - ${character.stats.general.ad.max}`} />
                        <GeneralStatRow icon="/fight/icono-ap.png" iconTint="magicalDamage" label="Valor de Ataque Mágico" value={`${character.stats.general.ap.min} - ${character.stats.general.ap.max}`} />
                        <GeneralStatRow icon="/game/armor.png" label="Defensa" value={character.stats.general.def} />
                        <GeneralStatRow icon="/game/va.png" label="Velocidad de ataque" value={character.stats.general.va} />
                        <GeneralStatRow icon="/game/cdr.png" label="Velocidad de hechizo" value={character.stats.general.vh} />
                        <GeneralStatRow icon="/game/vm.png" label="Velocidad de movimiento" value={character.stats.general.vm} />
                    </div>
                </div>
                <BonusPanel character={character} />
            </div>
            <div id='inventario' className="mx-[3.9%] mb-[4.5%] min-h-0">
                <Inventory character={character} />
            </div>
        </div>
    );
};
