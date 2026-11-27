import { ItemLowLevelUpgradeEffect, type ItemLowLevelUpgradeEffectProps } from "../item-low-level-upgrade/ItemLowLevelUpgradeEffect";

export type ItemLowLevelUpgradeFailureEffectProps = Omit<ItemLowLevelUpgradeEffectProps, "result">;

/** Use only for a confirmed failed upgrade that destroys the item. */
export const ItemLowLevelUpgradeFailureEffect = (props: ItemLowLevelUpgradeFailureEffectProps) => (
    <ItemLowLevelUpgradeEffect {...props} result="failure" />
);
