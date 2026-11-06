import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { CharacterSession, GetSkillUpgradePreviewResponse, SkillType } from "netim2-shared";
import { getSkillUpgradePreviewRequest } from "../api/character-skills.services";
import { getSkillPreviewKey, getSkillPreviewScope, shouldQuerySkillUpgrade, SkillUpgradePreviewCache } from "../utils/skill-upgrade-preview-cache";

export type SkillUpgradePreviewState = {
    status: "selection_preview" | "no_points" | "maximum" | "loading" | "error" | "ready";
    data?: GetSkillUpgradePreviewResponse;
    retry: () => void;
};

export function useSkillUpgradePreview(character: CharacterSession | undefined, skill: SkillType | undefined): SkillUpgradePreviewState {
    const scope = getSkillPreviewScope(character);
    const cache = useMemo(() => new SkillUpgradePreviewCache(scope), [scope]);
    useSyncExternalStore(cache.subscribe, cache.getSnapshot, cache.getSnapshot);
    const key = skill ? getSkillPreviewKey(skill) : "";
    const characterId = character?.id;
    const skillId = skill?.id;
    const eligible = Boolean(character && skill && shouldQuerySkillUpgrade(skill, character.puntos_habilidad));

    useEffect(() => {
        if (eligible && characterId && skillId !== undefined) {
            void cache.load(key, () => getSkillUpgradePreviewRequest(characterId, { skillId }));
        }
    }, [cache, characterId, skillId, eligible, key]);

    const retry = () => {
        if (eligible && characterId && skillId !== undefined) {
            void cache.load(key, () => getSkillUpgradePreviewRequest(characterId, { skillId }), true);
        }
    };
    if (!character) return { status: "selection_preview", retry };
    if (!skill || skill.mastery === "P") return { status: "maximum", retry };
    if (!eligible) return { status: "no_points", retry };
    const entry = cache.get(key);
    if (!entry || entry.status === "loading") return { status: "loading", retry };
    if (entry.status === "error") return { status: "error", retry };
    return { status: "ready", data: entry.data, retry };
}
