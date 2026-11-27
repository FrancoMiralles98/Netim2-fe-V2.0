import { UpgradeEffectView, type UpgradeEffectViewProps } from "../item-low-level-upgrade/UpgradeEffectView";

export type { ItemLowLevelUpgradeResult as ItemHighUpgradeResult } from "../item-low-level-upgrade/upgrade-renderer";

export interface ItemHighUpgradeEffectProps extends Omit<UpgradeEffectViewProps, "tier" | "skipPreparation"> {
    /** Defaults to 3600 ms, matching the approved high-upgrade preview. */
    preparationDuration?: number;
    /** Explosive success 2200 ms; destructive failure 1850 ms; protected failure 4300 ms. */
    endingDuration?: number;
}

/** Increasing item vibration, golden vortex, accelerating sparks, and an explosive success ending. */
export const ItemHighUpgradeEffect = ({
    preparationDuration = 3600,
    liftDistance = 36,
    ...props
}: ItemHighUpgradeEffectProps) => (
    <UpgradeEffectView {...props} preparationDuration={preparationDuration} liftDistance={liftDistance} tier="high" />
);
