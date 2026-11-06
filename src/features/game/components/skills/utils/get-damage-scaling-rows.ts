import type { SkillDamage, SkillValueScaling } from 'netim2-shared';
import { SKILL_SCALING_REFERENCES } from '../../../../../shared/constants/skill-scaling-references';

export interface ScalingRow {
    key: string;
    label: string;
    value: number;
    reference: number;
    attribute?: 'VIT' | 'STR' | 'DEX' | 'INT';
    path?: string;
    operation?: 'flat' | 'increased';
}

/** Promedia aportes equivalentes de ambos extremos; un aporte ausente vale cero. */
export function getDamageScalingRows(scaling: SkillDamage['escalado']): ScalingRow[] {
    return getValueScalingRows([scaling.components.damage.range.min, scaling.components.damage.range.max], 'damage');
}

/** Un valor para modificadores; dos extremos para promediar rangos de daño. */
export function getValueScalingRows(
    values: readonly SkillValueScaling[],
    kind: keyof typeof SKILL_SCALING_REFERENCES.lv,
): ScalingRow[] {
    const rows = new Map<string, ScalingRow>();
    const add = (row: ScalingRow) => {
        const previous = rows.get(row.key);
        rows.set(row.key, { ...row, value: (previous?.value ?? 0) + row.value / values.length });
    };
    const collect = (value: SkillValueScaling) => {
        const progression = value.progression;
        if (progression.type !== 'constant') {
            const total = progression.type === 'per_level'
                ? Object.values(progression.perLevel).reduce((sum, value) => sum + value, 0)
                : progression.thresholds.reduce((sum, threshold) => sum + threshold.add, 0);
            add({ key: 'lv', label: 'Lv', value: total, reference: SKILL_SCALING_REFERENCES.lv[kind] });
        }
        for (const contribution of value.contributions ?? []) {
            const { source, operation, coefficient } = contribution;
            const attribute = source.type === 'attribute' ? source.attribute : undefined;
            const path = source.type === 'stat' ? source.path : undefined;
            // AD/AP min y max representan la misma fuente en los dos extremos del daño.
            const sourceKey = attribute ?? path?.replace(/\.(min|max)$/, '') ?? '';
            const kind = attribute ? 'attribute' : /^general\.(ad|ap)$/.test(sourceKey) ? 'damage' : 'stat';
            add({ key: `${sourceKey}:${operation}`, label: attribute ?? sourceKey.replace(/^general\./, '').toUpperCase(),
                value: coefficient, reference: SKILL_SCALING_REFERENCES[kind][operation], attribute, path, operation });
        }
    };
    values.forEach(collect);
    return [...rows.values()];
}
