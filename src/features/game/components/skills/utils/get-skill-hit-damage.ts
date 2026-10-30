import type { SkillDamage } from "netim2-shared";

type HitOutcome = {
    chance: number;
    hits: number;
    damageMultiplierPerHit: number;
};

export const getSkillHitDamage = (skill: Pick<SkillDamage, "components" | "hitModifiers">, damageMultiplier = 1) => {
    const modifier = skill.hitModifiers;
    let outcomes: HitOutcome[] = [{ chance: 100, hits: 1, damageMultiplierPerHit: 1 }];

    if (modifier?.type === "chance_multi_hit") {
        const chance = Math.min(100, Math.max(0, modifier.chance));
        outcomes = [
            { chance: 100 - chance, hits: 1, damageMultiplierPerHit: 1 },
            { chance, hits: modifier.hits, damageMultiplierPerHit: modifier.damageMultiplierPerHit },
        ];
    } else if (modifier?.type === "weighted_hit_count") {
        const totalWeight = modifier.options.reduce((total, option) => total + option.chance, 0);
        outcomes = totalWeight > 0
            ? modifier.options.map((option) => ({ ...option, chance: option.chance / totalWeight * 100 }))
            : [];
    }

    return outcomes.filter((outcome) => outcome.chance > 0).map((outcome) => {
        const hits = Math.max(1, Math.floor(outcome.hits));
        const multiplier = Math.max(0, outcome.damageMultiplierPerHit);
        // El combate redondea cada componente por separado antes de sumarlo.
        const components = skill.components.map((component) => ({
            damageType: component.damageType,
            min: Math.max(0, Math.floor(Math.max(0, Math.floor(component.range.min)) * multiplier * damageMultiplier)),
            max: Math.max(0, Math.floor(Math.max(0, Math.floor(component.range.max)) * multiplier * damageMultiplier)),
        }));
        const perHit = components.reduce((total, component) => ({
            min: total.min + component.min,
            max: total.max + component.max,
        }), { min: 0, max: 0 });

        return {
            chance: outcome.chance,
            hits,
            components,
            perHit,
            total: { min: perHit.min * hits, max: perHit.max * hits },
        };
    });
};
