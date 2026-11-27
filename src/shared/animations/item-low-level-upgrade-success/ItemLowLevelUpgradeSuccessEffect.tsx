import { ItemLowLevelUpgradeEffect, type ItemLowLevelUpgradeEffectProps } from "../item-low-level-upgrade/ItemLowLevelUpgradeEffect";

export interface ItemLowLevelUpgradeSuccessEffectProps extends Omit<ItemLowLevelUpgradeEffectProps, "result" | "preparationDuration" | "endingDuration"> {
    /** Total sequence duration in milliseconds. */
    duration?: number;
}

/** Celebrates a confirmed successful low-level upgrade. Remount with a new key to replay. */
export const ItemLowLevelUpgradeSuccessEffect = ({
    duration = 3550,
    ...props
}: ItemLowLevelUpgradeSuccessEffectProps) => {
    const total = Number.isFinite(duration) && duration > 0 ? duration : 3550;
    return (
        <ItemLowLevelUpgradeEffect
            {...props}
            result="success"
            preparationDuration={total * 2300 / 3550}
            endingDuration={total * 1250 / 3550}
        />
    );
};
