import type { CharacterSession, GetSkillUpgradePreviewResponse, SkillType } from "netim2-shared";

type Entry = { status: "loading" } | { status: "error" } | { status: "ready"; data: GetSkillUpgradePreviewResponse };

/** One instance per character snapshot. Pending and fulfilled requests share the same key. */
export class SkillUpgradePreviewCache {
    readonly scope: string;
    private entries = new Map<string, Entry>();
    private listeners = new Set<() => void>();
    private version = 0;
    constructor(scope: string) { this.scope = scope; }
    get = (key: string): Entry | undefined => this.entries.get(key);
    subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
    getSnapshot = () => this.version;
    private emit() { this.version++; for (const listener of this.listeners) listener(); }
    async load(key: string, loader: () => Promise<GetSkillUpgradePreviewResponse>, retry = false): Promise<void> {
        const existing = this.entries.get(key);
        if (existing && (!retry || existing.status !== "error")) return;
        this.entries.set(key, { status: "loading" });
        this.emit();
        try {
            const data = await loader();
            this.entries.set(key, { status: "ready", data });
        } catch {
            this.entries.set(key, { status: "error" });
        }
        this.emit();
    }
}

export function getSkillPreviewScope(character?: CharacterSession): string {
    if (!character) return "speciality-selection";
    const { id, raza, especialidad, lv, reino, stats, atributos, buffos, inventario,
        equipo_selected, equipo_1, equipo_2, equipo_3, hab, puntos_habilidad } = character;
    return JSON.stringify({ id, raza, especialidad, lv, reino, stats, atributos, buffos, inventario,
        equipo_selected, equipo_1, equipo_2, equipo_3, hab, puntos_habilidad });
}

export const getSkillPreviewKey = (skill: Pick<SkillType, "id" | "mastery" | "lv">) => `${skill.id}:${skill.mastery}:${skill.lv}`;
export const shouldQuerySkillUpgrade = (skill: Pick<SkillType, "mastery">, points: number) => skill.mastery === "M" || skill.mastery === "G" || (skill.mastery === "N" && points > 0);
