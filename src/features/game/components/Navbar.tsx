import { base_timers_pvm_multiplier, timer_pvp as PVP_DURATION_MS, type CharacterSession } from "netim2-shared";
import { getIconRace } from "../../characterSelection/utils/character-selecition-utils";
import { useUserSession } from "../../userSession/hook/useUserSession";
import { ResourcePercentBar } from "../../../shared/bars/components/ResourcePercentBar";
import { MiniTooltip } from "../../../shared/tooltip/components/MiniTooltip";
import { CountdownTimerBar } from "./CountdownTimerBar";
import { ExperienceIndicator } from "./ExperienceIndicator";

interface NavbarProps {
    character: CharacterSession;
}

const currencyFormatter = new Intl.NumberFormat('es-AR');

export const Navbar = ({ character }: NavbarProps) => {
    const { user } = useUserSession();
    const timeReductionFactor = Math.max(0, 1 - character.stats.bonus.miscs.time_reduction / 100);
    const basePvmDurationMs = character.timer_lv * timeReductionFactor * 1000;

    return (
        <div
            id='navbar'
            className="col-span-2 grid grid-cols-[23%_auto] aspect-[15/1] bg-top bg-no-repeat bg-[length:100%_100%]"
            style={{ backgroundImage: character.reino ? `url('/modal/navbar-${character.reino}.png')` : undefined }}
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
                    <div id='yang-md' className="flex flex-col justify-center gap-1 px-2">
                        <MiniTooltip text="Yang">
                            <div className="flex h-[26px] w-full min-w-0 items-center justify-between gap-2 bg-[url('/utils/fondo-eco.png')] bg-[length:100%_100%] bg-no-repeat px-2">
                                <img className="h-[13px] w-[13px]" src="/utils/yang-icon.png" alt="" />
                                <p className="min-w-0 truncate text-right text-sm tracking-wide font-light text-white">{currencyFormatter.format(character.yang)}</p>
                            </div>
                        </MiniTooltip>
                        <MiniTooltip text="Md">
                            <div className="flex h-[26px] w-full min-w-0 items-center justify-between gap-2 bg-[url('/utils/fondo-eco.png')] bg-[length:100%_100%] bg-no-repeat px-2">
                                <img className="h-[16px] w-[15px]" src="/utils/md-icon.png" alt="" />
                                <p className="min-w-0 truncate text-right text-sm tracking-wide font-light text-white">{currencyFormatter.format(user?.md ?? 0)}</p>
                            </div>
                        </MiniTooltip>
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
    );
};
