import { UpgradeEffectView, type UpgradeEffectViewProps } from "./UpgradeEffectView";

export type { ItemLowLevelUpgradeResult } from "./upgrade-renderer";
export type ItemLowLevelUpgradeEffectProps = Omit<UpgradeEffectViewProps, "tier" | "skipPreparation">;

/** Low-level charge with success, destructive failure, or protected failure. */
export const ItemLowLevelUpgradeEffect = (props: ItemLowLevelUpgradeEffectProps) => (
    <UpgradeEffectView {...props} tier="low" />
);
