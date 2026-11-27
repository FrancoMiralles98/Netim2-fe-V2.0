import { UpgradeEffectView, type UpgradeEffectViewProps } from "../item-low-level-upgrade/UpgradeEffectView";

export type ItemUpgradeProtectedFailureEffectProps = Omit<UpgradeEffectViewProps, "tier" | "result" | "preparationDuration" | "skipPreparation">;

/** Plays only the protected-failure ending, beginning with the item charged and elevated. */
export const ItemUpgradeProtectedFailureEffect = (props: ItemUpgradeProtectedFailureEffectProps) => (
    <UpgradeEffectView {...props} tier="low" result="protected-failure" skipPreparation />
);
