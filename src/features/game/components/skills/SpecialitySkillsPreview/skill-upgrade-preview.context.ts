import { createContext, useContext } from "react";
import type { SkillType } from "netim2-shared";
import type { SkillUpgradePreviewState } from "../../../hooks/useSkillUpgradePreview";

export const SkillUpgradePreviewContext = createContext<SkillUpgradePreviewState | null>(null);
export const useSkillUpgrade = () => useContext(SkillUpgradePreviewContext);
export const useNextSkill = (): SkillType | null => useSkillUpgrade()?.data?.next ?? null;
