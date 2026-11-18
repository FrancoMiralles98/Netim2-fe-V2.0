import type { MobType } from "netim2-shared";
import { GeneralStatRow } from "../game/components/profile/GeneralStatRow";

const formatNumber = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format;

export const MobGeneralStatsPanel = ({ general }: { general: MobType["stats"]["general"] }) => {
    const { hp, mana, ad, ap } = general;

    return (
        <section
            aria-label="Estadísticas generales del enemigo"
            className="w-max max-w-full bg-[url('/game/marco-stats.png')] bg-[length:100%_100%] bg-no-repeat"
        >
            <h4 className="flex h-8 items-center justify-center px-2 text-center text-xs font-semibold text-[#e9cf99]">
                Estadísticas generales
            </h4>
            <div className="grid auto-rows-[21px] px-4 pt-1 pb-3">
                <GeneralStatRow
                    icon="/fight/healt-icon1.png" iconTint="health" label="Vida"
                    value={formatNumber(hp.actual)}
                />
                <GeneralStatRow
                    icon="/fight/mana-icon1.png" iconTint="mana" label="Maná"
                    value={formatNumber(mana.actual)}
                />
                <GeneralStatRow icon="/game/regen-vida.png" iconTint="healthRegen" label="Regeneración de vida" value={formatNumber(general.regen_hp)} />
                <GeneralStatRow icon="/game/regen-mana.png" iconTint="manaRegen" label="Regeneración de maná" value={formatNumber(general.regen_mana)} />
                <GeneralStatRow icon="/fight/icono-ad.png" iconTint="physicalDamage" label="Valor de Ataque" value={`${formatNumber(ad.min)} - ${formatNumber(ad.max)}`} />
                <GeneralStatRow icon="/fight/icono-ap.png" iconTint="magicalDamage" label="Valor de Ataque Mágico" value={`${formatNumber(ap.min)} - ${formatNumber(ap.max)}`} />
                <GeneralStatRow icon="/game/armor.png" label="Defensa" value={formatNumber(general.def)} />
                <GeneralStatRow icon="/game/va.png" label="Velocidad de ataque" value={formatNumber(general.va)} />
                <GeneralStatRow icon="/game/cdr.png" label="Velocidad de hechizo" value={formatNumber(general.vh)} />
                <GeneralStatRow icon="/game/vm.png" label="Velocidad de movimiento" value={formatNumber(general.vm)} />
            </div>
        </section>
    );
};
