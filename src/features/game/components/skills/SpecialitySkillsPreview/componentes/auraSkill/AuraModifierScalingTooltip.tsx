import { bonusFullNameByRef, type SkillAura, type StatsModifiers } from 'netim2-shared';
import { getValueScalingRows } from '../../../utils/get-damage-scaling-rows';
import { ScalingTooltip } from '../damageSkill/DamageScalingTooltip';

export const AuraModifierScalingTooltip = ({ scaling, modifier }: {
    scaling: SkillAura['escalado'];
    modifier: StatsModifiers;
}) => {
    const config = scaling.statsModifiers.filter(entry => entry.target === modifier.target && entry.operation === modifier.operation);
    if (!config.length) return null;
    // Cada modificador tiene un valor único, no un rango mínimo/máximo.
    const rows = config.flatMap((entry, index) => getValueScalingRows([entry.value], 'stat').map(row => ({ ...row, key: `${index}:${row.key}` })));
    return <ScalingTooltip rows={rows} title={`Escalado: ${bonusFullNameByRef(modifier.bonusRefKey)}`} />;
};
