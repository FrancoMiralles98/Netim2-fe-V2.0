import { base_timers_pvm_multiplier, timer_pvp as PVP_DURATION_MS } from "netim2-shared";
import { getIconRace } from "../../features/characterSelection/utils/character-selecition-utils";
import { CountdownTimerBar } from "../../features/game/components/CountdownTimerBar";
import { ExperienceIndicator } from "../../features/game/components/ExperienceIndicator";
import { useGameGuard } from "../../features/game/hooks/useGame";
import { useUserSession } from "../../features/userSession/hook/useUserSession";
import { ResourcePercentBar } from "../../shared/bars/components/ResourcePercentBar";
import { ButtonReino } from "../../shared/button/ButtonReino";
import { MiniTooltip } from "../../shared/tooltip/components/MiniTooltip";

const currencyFormatter = new Intl.NumberFormat('es-AR');

export const Game = () => {
    const {
        character,
        worldSessionId,
        gameReady,
    } = useGameGuard();
    const { user } = useUserSession();


    if (!gameReady || !character || !worldSessionId) {
        return null;
    }

    const reino = character.reino;
    const timeReductionFactor = Math.max(0, 1 - character.stats.bonus.miscs.time_reduction / 100);
    const basePvmDurationMs = character.timer_lv * timeReductionFactor * 1000;

    return (
        <section
            id='bg'
            className="min-h-[100dvh] min-w-[1300px] bg-[url('/game/bg-game.png')] bg-auto bg-repeat bg-top"
        >
            <div id='position' className="grid grid-cols-[17%_auto] min-h-[300px] w-[1300px] mx-auto">
                <div
                    id='navbar'
                    className="col-span-2 grid grid-cols-[23%_auto] aspect-[15/1] bg-top bg-no-repeat bg-[length:100%_100%]"
                    style={{ backgroundImage: reino ? `url('/modal/navbar-${reino}.png')` : undefined }}
                >
                    <div id='navbar 1 horizontal' className="gap-y-3 ">
                        <div id='general_options' className="h-full">
                            <section className="flex justify-center h-full items-center gap-3">

                                <MiniTooltip text="Configuración">
                                    <img src="/game/icons_hud_2.png" className="" alt="" />
                                </MiniTooltip>
                                <MiniTooltip text="Almacén">
                                    <img src="/game/icons_hud_1.png" className="" alt="" />
                                </MiniTooltip>
                                <MiniTooltip text="Perfil">
                                    <img src="/game/icons_hud_3.png" className="" alt="" />
                                </MiniTooltip>
                            </section>
                        </div>
                    </div>
                    <div id='navbar 2 horizontal' className="gap-y-3">
                        <div id='general_options' className="h-full grid grid-cols-[8%_15%_17%_13%_20%_20%] w-[93%] ">
                            <div id='icon' className="flex items-center justify-end ">
                                <MiniTooltip text="Perfil">
                                    <img
                                        src={getIconRace(character.raza, character.genero)}
                                        className="w-[41px] h-[40px] ml-1"
                                        alt="" />

                                </MiniTooltip>
                            </div>
                            <div
                                id="vida-mana-lv"
                                className="flex flex-col items-center justify-center gap-1 px-2"
                            >
                                <ResourcePercentBar
                                    current={character.stats.general.hp.actual}
                                    max={character.stats.general.hp.max}
                                    variant="hp"
                                />
                                <ResourcePercentBar
                                    current={character.stats.general.mana.actual}
                                    max={character.stats.general.mana.max}
                                    variant="mana"
                                />
                                <span className="text-sm mt-[2px] font-semibold gap-1 leading-none flex text-amber-100">
                                    <MiniTooltip text="Nivel">
                                        <img src="/game/lv.png" alt="" />
                                    </MiniTooltip>
                                    {character.lv}
                                </span>
                            </div>
                            <div id='yang-md' className=" flex flex-col items-start justify-center gap-1 px-2">
                                <div className="flex justify-start gap-1 text-gray-100">
                                    <MiniTooltip text="Yang">
                                        <img className="w-[20px]" src="/game/Yang.png" alt="" />
                                    </MiniTooltip>
                                    <p className="font-normal text-yellow-300">{currencyFormatter.format(character.yang)}</p>
                                </div>
                                <div className="flex justify-start gap-1 text-gray-100">
                                    <MiniTooltip text="Md">
                                        <img className="w-[20px]" src="/game/md.png" alt="" />
                                    </MiniTooltip>
                                    <p className="font-normal text-orange-300">{currencyFormatter.format(user?.md ?? 0)}</p>
                                </div>
                            </div>

                            <ExperienceIndicator
                                exp={character.exp}
                                expNextLv={character.exp_next_lv}
                            />
                            <div id='timers_1' className="flex flex-col items-start justify-center gap-1 px-2 ">
                                <div className="flex w-full min-w-0 items-center gap-1">
                                    <MiniTooltip text="Pelear contra Mobs">
                                        <img src="/game/icon_pvm.png" className="h-7.5 w-7.5 shrink-0" alt="" />
                                    </MiniTooltip>
                                    <CountdownTimerBar
                                        endsAt={character.timer_mob}
                                        durationMs={basePvmDurationMs * base_timers_pvm_multiplier.mob}
                                        label="PvM"
                                    />
                                </div>
                                <div className="flex w-full min-w-0 items-center gap-1">
                                    <MiniTooltip text="Pelear contra Netims">
                                        <img src="/game/icon_pvm_netim.png" className="h-7.5 w-7.5 shrink-0" alt="" />
                                    </MiniTooltip>
                                    <CountdownTimerBar
                                        endsAt={character.timer_metin}
                                        durationMs={basePvmDurationMs * base_timers_pvm_multiplier.netims}
                                        label="Metin"
                                    />
                                </div>
                            </div>
                            <div id='timers_2' className="flex flex-col items-start justify-center gap-1 px-2 ">
                                <div className="flex w-full min-w-0 items-center gap-1">
                                    <MiniTooltip text="Pelear en Batallas PvP">
                                        <img src="/game/icon_pvp.png" className="h-7.5 w-7.5 shrink-0" alt="" />
                                    </MiniTooltip>
                                    <CountdownTimerBar
                                        endsAt={character.timer_pvp}
                                        durationMs={PVP_DURATION_MS}
                                        label="PvP"
                                    />
                                </div>
                                <div className="flex w-full min-w-0 items-center gap-1">
                                    <MiniTooltip text="Pelear contra Jefes">
                                        <img src="/game/icon_pvm_boss.png" className="h-7.5 w-7.5 shrink-0" alt="" />
                                    </MiniTooltip>
                                    <CountdownTimerBar
                                        endsAt={character.timer_boss}
                                        durationMs={basePvmDurationMs * base_timers_pvm_multiplier.boss}
                                        label="Jefe"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section id='paneles de rutas'>
                    {reino && (
                        <>
                            <div className="relative mt-[2rem]" id='fondo-chico'>
                                <img
                                    className="block w-full h-[165px]"
                                    src={`/game/fondo-2-${reino}.png`}
                                    alt=""
                                />
                                <div className="absolute inset-0 z-10 flex flex-col items-start justify-start gap-1 px-4 pt-4">
                                    <ButtonReino reino={reino} texto="Clasificación"/>
                                    <ButtonReino reino={reino} texto="Gremio"/>
                                    <ButtonReino reino={reino} texto="Item Shop"/>
                                    <ButtonReino reino={reino} texto="Wiki"/>
                                </div>
                            </div>
                            <div className="relative mt-[2rem]" id='fondo-grande'>
                                <img
                                    className="block h-[30rem] w-full"
                                    src={`/game/fondo-${reino}.png`}
                                    alt=""
                                />
                                <div className="absolute mt-[5rem] mb-[1rem] inset-0 z-10 flex flex-col items-start justify-start gap-[5px] px-4">
                                    <ButtonReino reino={reino} texto="Tienda General" />
                                    <ButtonReino reino={reino} texto="Tienda De Armas" />
                                    <ButtonReino reino={reino} texto="Tienda De Armaduras" />
                                    <ButtonReino reino={reino} texto="Arena" />
                                    <ButtonReino reino={reino} texto="Herrero" />
                                    <ButtonReino reino={reino} texto="Capitán" />
                                    <ButtonReino reino={reino} texto="Establo" />
                                    <ButtonReino reino={reino} texto="Encantador" />
                                    <ButtonReino reino={reino} texto="Orfebre" />
                                    <ButtonReino reino={reino} texto="Mercado" />
                                    <ButtonReino reino={reino} texto="La Costa" />
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </section>
    )
}
