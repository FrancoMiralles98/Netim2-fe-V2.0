import { useState } from "react";
import type { GetMobsByUbicationResponse, MobSummary } from "netim2-shared";
import { MobInfoModal } from "./MobInfoModal";

const ENEMY_LABELS = {
    mob: "Enemigo",
    netim: "Netim",
    boss: "Jefe",
    raid: "Raid",
} satisfies Record<MobSummary["enemie_type"], string>;

const ZoneMobCard = ({ mob, onOpen }: { mob: MobSummary; onOpen: () => void }) => (
    <article className="relative flex h-full flex-col gap-3 rounded border border-[#80603a] bg-[#1b1512]/95 p-4 shadow-md hover:border-amber-300">
        <h3 className="font-metin text-base font-semibold text-amber-100">{mob.nombre}</h3>
        <p className="text-sm text-amber-300">{ENEMY_LABELS[mob.enemie_type]}</p>
        <dl className="mt-auto grid grid-cols-2 gap-2 text-sm text-slate-200">
            <div>
                <dt className="text-slate-400">Nivel</dt>
                <dd>{mob.lv}</dd>
            </div>
            <div>
                <dt className="text-slate-400">Dificultad</dt>
                <dd>{mob.dificultad}</dd>
            </div>
        </dl>
        <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`Ver información de ${mob.nombre}`}
            onClick={onOpen}
            className="absolute inset-0 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-amber-200"
        />
    </article>
);

interface ExploreZoneProps {
    name: string;
    landscape: string;
    mobs: GetMobsByUbicationResponse;
    onBack: () => void;
    onFight: (mob: MobSummary) => Promise<boolean>;
    isStartingFight: boolean;
}

export const ExploreZone = ({ name, landscape, mobs, onBack, onFight, isStartingFight }: ExploreZoneProps) => {
    const [selectedMob, setSelectedMob] = useState<MobSummary | null>(null);

    return (
        <section
            aria-labelledby="explore-zone-title"
            className="absolute inset-x-[6%] inset-y-[8%] flex flex-col overflow-hidden rounded border border-[#80603a] bg-[#1b1512] bg-cover bg-center text-slate-100"
            style={{ backgroundImage: `linear-gradient(#110d0bd9, #110d0bf2), url('${landscape}')` }}
        >
            <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#80603a] px-4 py-3">
                <h2 id="explore-zone-title" className="font-metin text-xl text-amber-100">{name}</h2>
                <button
                    type="button"
                    onClick={onBack}
                    className="cursor-pointer rounded border border-[#b18853] bg-[#20160f] px-3 py-1.5 text-sm text-amber-100 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-amber-200"
                >
                    Volver al portal
                </button>
            </header>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
                {mobs.length > 0 ? (
                    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,12rem),1fr))] gap-3">
                        {mobs.map((mob) => (
                            <li key={mob.idMob}>
                                <ZoneMobCard mob={mob} onOpen={() => setSelectedMob(mob)} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-300">No hay enemigos disponibles en esta zona.</p>
                )}
            </div>
            {selectedMob && (
                <MobInfoModal
                    key={selectedMob.idMob}
                    mob={selectedMob}
                    onClose={() => setSelectedMob(null)}
                    isStartingFight={isStartingFight}
                    onFight={() => {
                        void onFight(selectedMob).then((started) => {
                            if (started) setSelectedMob(null);
                        });
                    }}
                />
            )}
        </section>
    );
};
