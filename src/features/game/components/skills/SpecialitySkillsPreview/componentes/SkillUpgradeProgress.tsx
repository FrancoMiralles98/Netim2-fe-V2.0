import { useSkillUpgrade } from "../skill-upgrade-preview.context";
import { useSkillUpgradeActions } from "../../../../hooks/useSkillUpgradeActions";
import { SkillUpgradeMaterials } from "./SkillUpgradeMaterials";

export const SkillUpgradeProgress = () => {
    const preview = useSkillUpgrade();
    const { upgrade, isPending } = useSkillUpgradeActions();
    if (!preview) return null;
    const { status, data, retry } = preview;
    return (
        <div className="mt-5 space-y-3 text-sm" aria-live="polite">
            {status === "selection_preview" && <p className="text-slate-400">Disponible al elegir una especialidad</p>}
            {status === "loading" && <p role="status" className="text-slate-300">Consultando siguiente nivel...</p>}
            {status === "error" && <div role="alert" className="space-y-2 text-red-300"><p>No se pudo consultar la mejora.</p><button type="button" onClick={retry} className="cursor-pointer underline">Reintentar</button></div>}
            {status === "no_points" && <p className="text-slate-400">Necesitas puntos de habilidad para consultar la mejora.</p>}
            {(status === "maximum" || (status === "ready" && !data?.next)) && <p className="text-slate-400">Nivel máximo alcanzado.</p>}
            {status === "ready" && data?.next && <>
                <p>Siguiente nivel: <span className="text-green-400">{data.next.mastery} · Nivel {data.next.lv}</span></p>
                <button type="button" disabled={!data.canUpgrade || isPending} onClick={() => upgrade(data.current.id)} className={`w-full rounded border border-amber-300/70 bg-amber-400/15 px-4 py-2 text-amber-200 disabled:cursor-not-allowed disabled:opacity-50 ${data.canUpgrade && !isPending ? 'animate-pulse cursor-pointer hover:animate-none hover:bg-amber-400/25 motion-reduce:animate-none' : ''}`}>Subir de nivel</button>
                {data.cost?.type === "skill_points" && <p>Coste: {data.cost.amount} {data.cost.amount === 1 ? "punto de habilidad" : "puntos de habilidad"}</p>}
                {data.cost?.type === "materials" && <SkillUpgradeMaterials items={data.cost.items} />}
                {!data.canUpgrade && <p className="text-amber-200">{data.reason ?? "Mejora no disponible."}</p>}
            </>}
        </div>
    );
};
