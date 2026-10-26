import type { CharacterSession, GameConfigResponse } from "netim2-shared";
import { useCharacterSession } from "../../../characterSession/hooks/useCharacterSession";
import { GeneralStatRow, type GeneralStatDetail } from "./GeneralStatRow";

const numberFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });
const formatNumber = (value: number) => numberFormatter.format(value);
const formatPercent = (value: number) => `${formatNumber(value)}%`;

const getCooldownReductionPercent = (
    castSpeed: number,
    config: GameConfigResponse['combat']['cooldownScaling'],
) => {
    const { maxReductionPercent, initialReductionPerPoint, decayRate, maxReductionPoints } = config;
    if (!Number.isFinite(castSpeed) || castSpeed <= 0) return 0;
    if (castSpeed >= maxReductionPoints) return maxReductionPercent;

    const exponentialAtMax = -Math.expm1(-decayRate * maxReductionPoints) / decayRate;
    const linearSlope = (maxReductionPercent - initialReductionPerPoint * exponentialAtMax)
        / (maxReductionPoints - exponentialAtMax);
    const exponentialContribution = -Math.expm1(-decayRate * castSpeed) / decayRate;

    return linearSlope * castSpeed
        + (initialReductionPerPoint - linearSlope) * exponentialContribution;
};

const attackCountLabel = (count: number) => {
    if (count === 2) return 'Doble ataque básico';
    if (count === 3) return 'Triple ataque básico';
    return `${count} ataques básicos`;
};

const getAttackSpeedDetails = (attackSpeed: number): GeneralStatDetail[] => {
    const missChance = attackSpeed < 0 ? Math.abs(attackSpeed) : 0;
    if (attackSpeed <= 0) {
        return [
            { label: 'Chances de errar ataques básicos', value: formatPercent(missChance) },
            { label: 'Chances de realizar Doble ataque básico', value: '0%' },
            { label: 'Chances de realizar Triple ataque básico', value: '0%' },
        ];
    }

    const guaranteedHits = 1 + Math.floor(attackSpeed / 100);
    const extraHitChance = attackSpeed % 100;
    const details: GeneralStatDetail[] = [
        { label: 'Chances de errar básicos', value: '0%' },
    ];

    if (guaranteedHits === 1) {
        details.push({ label: ' Chances de realizar Doble ataque básico', value: formatPercent(extraHitChance) });
        details.push({ label: ' Chances de realizar Triple ataque básico', value: '0%' });
    } else if (guaranteedHits === 2) {
        details.push({ label: 'Chances de realizar Doble ataque básico', value: formatPercent(100 - extraHitChance) });
        details.push({ label: 'Chances de realizar Triple ataque básico', value: formatPercent(extraHitChance) });
    } else {
        if (guaranteedHits > 3) {
            details.push({ label: 'Chances de realizar Triple ataque básico', value: '0%' });
        }
        details.push({ label: attackCountLabel(guaranteedHits), value: formatPercent(100 - extraHitChance) });
        if (extraHitChance > 0) {
            details.push({ label: attackCountLabel(guaranteedHits + 1), value: formatPercent(extraHitChance) });
        }
    }

    return details;
};

export const GeneralStatsPanel = ({ character }: { character: CharacterSession }) => {
    const { gameConfig } = useCharacterSession();
    const { general, bonus } = character.stats;
    const hpPercentage = general.hp.max > 0
        ? Math.min(100, Math.max(0, general.hp.actual / general.hp.max * 100))
        : 0;

    const manaPercentage = general.mana.max > 0
        ? Math.min(100, Math.max(0, general.mana.actual / general.mana.max * 100))
        : 0;

    const cooldownConfig = gameConfig?.combat.cooldownScaling;
    const cooldownReduction = cooldownConfig
        ? formatPercent(getCooldownReductionPercent(general.vh, cooldownConfig))
        : '—';
    const movementSpeed = Math.max(0, general.vm);
    const basicDodge = gameConfig
        ? formatPercent(movementSpeed * gameConfig.combat.dodgePerMovementSpeed)
        : '—';
    const spellDodge = gameConfig
        ? formatPercent(movementSpeed * gameConfig.combat.spellDodgePerMovementSpeed)
        : '—';

    return (
        <div id="stats-generales" className="h-full px-1 w-[30%] shrink-0 bg-[url('/game/marco-stats.png')] bg-[length:100%_100%] bg-no-repeat">
            <div className="flex h-[13%] items-center justify-center px-4 text-[12px] font-semibold text-[#e9cf99]">
                Estadísticas generales
            </div>
            <div className="grid h-[87%] grid-rows-10 px-4 pt-1 pb-3">
                <GeneralStatRow
                    icon="/fight/healt-icon1.png" iconTint="health" label="Vida"
                    value={`${general.hp.actual} / ${general.hp.max}`} progress={hpPercentage}
                    description="Indica la vida actual del personaje y su vida máxima."
                />
                <GeneralStatRow
                    icon="/fight/mana-icon1.png" iconTint="mana" label="Maná"
                    value={`${general.mana.actual} / ${general.mana.max}`} progress={manaPercentage} progressColor="mana"
                    description="Indica el maná actual del personaje y su maná máximo."
                />
                <GeneralStatRow
                    icon="/game/regen-vida.png" iconTint="healthRegen" label="Regeneración de vida" value={general.regen_hp}
                    description="Recupera vida al inicio de cada turno."
                    details={[{ label: 'Por cada turno recuperas', value: `${formatNumber(general.regen_hp)} de vida` }]}
                />
                <GeneralStatRow
                    icon="/game/regen-mana.png" iconTint="manaRegen" label="Regeneración de maná" value={general.regen_mana}
                    description="Recupera maná al inicio de cada turno."
                    details={[{ label: 'Por cada turno recuperas', value: `${formatNumber(general.regen_mana)} de maná` }]}
                />
                <GeneralStatRow
                    icon="/fight/icono-ad.png" iconTint="physicalDamage" label="Valor de Ataque"
                    value={`${general.ad.min} - ${general.ad.max}`}
                    description="Determina el daño de tus ataques básicos y contribuye al escalado de las habilidades de daño físico. Los valores potenciales son previos a defensas y otros bonus."
                    details={[
                        { label: 'Ataque básico potencial', value: formatNumber(general.ad.max) },
                        { label: 'Ataque básico potencial con crítico', value: formatNumber(general.ad.max * bonus.daño.daño_critico) },
                    ]}
                />
                <GeneralStatRow
                    icon="/fight/icono-ap.png" iconTint="magicalDamage" label="Valor de Ataque Mágico"
                    value={`${general.ap.min} - ${general.ap.max}`}
                    description="Contribuye al escalado de las habilidades que infligen daño mágico."
                />
                <GeneralStatRow
                    icon="/game/armor.png" label="Defensa" value={general.def}
                    description="Reduce de forma plana el daño recibido de ataques básicos."
                />
                <GeneralStatRow
                    icon="/game/va.png" label="Velocidad de ataque" value={general.va}
                    description="Determina la probabilidad de errar ataques básicos o realizar ataques básicos adicionales. Cada 100 puntos garantizan un ataque adicional."
                    details={getAttackSpeedDetails(general.va)}
                />
                <GeneralStatRow
                    icon="/game/cdr.png" label="Velocidad de hechizo" value={general.vh}
                    description="Otorga reducción de enfriamiento a las habilidades."
                    details={[{ label: 'Reducción de enfriamiento', value: cooldownReduction }]}
                />
                <GeneralStatRow
                    icon="/game/vm.png" label="Velocidad de movimiento" value={general.vm}
                    description="Aporta probabilidad de esquivar ataques básicos y habilidades."
                    details={[
                        { label: 'Chances de esquivar ataques básicos', value: basicDodge },
                        { label: 'Chances de esquivar habilidades', value: spellDodge },
                    ]}
                />
            </div>
        </div>
    );
};
