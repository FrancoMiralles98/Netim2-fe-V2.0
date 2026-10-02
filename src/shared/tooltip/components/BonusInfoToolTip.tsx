import { bonusFullNameByRef, type BonusRefKeys } from "netim2-shared";
import { InfoTooltip } from "./InfoToolTip";
import { getBonusDescription } from "../utils/bonus-info-tool-tip";

export const BonusInfoToolTip = ({
    bonusRef,
    position = 'top'
}: {
    bonusRef: BonusRefKeys,
    position?: 'top' | 'bottom' | 'left' | 'right';
}) => {

    return (
        <InfoTooltip
            title={bonusFullNameByRef(bonusRef)}
            message={getBonusDescription(bonusRef)}
            position={position}
            size="small"
        />
    )
}
