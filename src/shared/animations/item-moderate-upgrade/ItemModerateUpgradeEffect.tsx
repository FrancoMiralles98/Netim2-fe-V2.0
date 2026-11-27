import { UpgradeEffectView, type UpgradeEffectViewProps } from "../item-low-level-upgrade/UpgradeEffectView";

export type { ItemLowLevelUpgradeResult as ItemModerateUpgradeResult } from "../item-low-level-upgrade/upgrade-renderer";

export interface ItemModerateUpgradeEffectProps extends Omit<UpgradeEffectViewProps, "tier" | "skipPreparation"> {
    /** Golden success 2100 ms; destructive failure 1850 ms; protected failure 4300 ms. */
    endingDuration?: number;
}

/** White-gold charge with a growing vibrating ring, golden success, or the shared failure ending. */
export const ItemModerateUpgradeEffect = (props: ItemModerateUpgradeEffectProps) => (
    <UpgradeEffectView {...props} tier="moderate" />
);
