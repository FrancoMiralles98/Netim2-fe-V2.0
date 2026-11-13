import { useId, useRef, useState } from 'react';
import type { SkillDamage } from 'netim2-shared';
import { StatBar } from '../../../../../../../shared/bars/components/StatBar';
import { getStatIcon, getStatIconColor } from '../../../../../../../shared/icons/stat-icons';
import { SKILL_SCALING_RATINGS } from '../../../../../../../shared/constants/skill-scaling-references';
import { InventoryTooltipPortal } from '../../../../../../inventory/components/InventoryTooltipPortal';
import { getDamageScalingRows, type ScalingRow } from '../../../utils/get-damage-scaling-rows';

export const ScalingBar = ({ row }: { row: ScalingRow }) => {
    const ratio = Math.max(0, row.value / row.reference);
    const rating = row.value < 0 ? 'Reducción' : SKILL_SCALING_RATINGS.find(entry => ratio >= entry.ratio)?.label ?? 'Muy bajo';
    const icon = row.path ? getStatIcon(row.path) : undefined;
    const stat = row.path?.split('.')[1];
    const texture = row.attribute ? undefined
        : !row.path ? 'extra'
        : stat === 'ad' || stat === 'ap' ? stat
        : 'stats';
    return <div title={`${row.label}: ${row.value} / referencia ${row.reference}`}>
        <StatBar name={row.attribute ?? 'STR'} label={icon ? <span role="img" aria-label={row.label} className={`block h-4 w-4 shrink-0 bg-current ${getStatIconColor(row.path ?? '')}`} style={{ mask: `url('${icon}') center / contain no-repeat` }} /> : texture === 'extra' ? <span className="text-gray-300">{row.label}</span> : row.label}
            texture={texture} value={Math.max(0, row.value)} maxValue={row.reference} valueLabel={rating} isActive />
    </div>;
};

export const DamageScalingDetails = ({ scaling }: { scaling: SkillDamage['escalado'] }) => {
    const rows = getDamageScalingRows(scaling);
    return <div className="w-[330px] max-w-full space-y-2 text-left">
        <h4 className="text-amber-200 text-center">Escalado del daño base</h4>
        {rows.map(row => <ScalingBar key={row.key} row={row} />)}
        {!rows.length && <p className="text-xs text-slate-400">Daño constante, sin aportes de escalado.</p>}
    </div>;
};

export const ScalingTooltip = ({ rows, title }: { rows: ScalingRow[]; title: string }) => {
    const anchor = useRef<HTMLButtonElement>(null);
    const id = useId();
    const [open, setOpen] = useState(false);
    return <><button type="button" ref={anchor} aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}
        className="inline-flex shrink-0 cursor-help items-center rounded border border-amber-200/40 bg-amber-200/10 px-2 py-1 text-xs text-amber-200 hover:bg-amber-200/20 focus-visible:outline focus-visible:outline-amber-200">Escalado</button>
        {open && <InventoryTooltipPortal anchorRef={anchor} id={id}>
            <div className="w-[330px] max-w-full space-y-2 text-left">
                <h4 className="text-amber-200">{title}</h4>
                {rows.map(row => <ScalingBar key={row.key} row={row} />)}
                {!rows.length && <p className="text-xs text-slate-400">Valor constante, sin aportes de escalado.</p>}
            </div>
        </InventoryTooltipPortal>}
    </>;
};

export const DamageScalingTooltip = ({ scaling }: { scaling: SkillDamage['escalado'] }) => (
    <ScalingTooltip rows={getDamageScalingRows(scaling)} title="Escalado del daño base" />
);
