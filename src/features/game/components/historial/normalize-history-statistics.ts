import type { FighterCombatStatisticsState } from "netim2-shared";

/** Los historiales persistidos pueden omitir objetos vacíos o campos añadidos después del combate. */
export const normalizeHistoryStatistics = (
    statistics: FighterCombatStatisticsState | null | undefined,
): FighterCombatStatisticsState => ({
    damage: {
        dealt: {
            total: statistics?.damage?.dealt?.total ?? 0,
            byDamageType: { ad: 0, ap: 0, true: 0, ...statistics?.damage?.dealt?.byDamageType },
            byDelivery: { direct: 0, periodic: 0, reflected: 0, ...statistics?.damage?.dealt?.byDelivery },
            bySource: { basicAttack: 0, skills: 0, statusEffects: 0, reflected: 0, ...statistics?.damage?.dealt?.bySource },
            bySkill: statistics?.damage?.dealt?.bySkill ?? {},
            byStatusEffect: statistics?.damage?.dealt?.byStatusEffect ?? {},
        },
        mitigated: {
            total: statistics?.damage?.mitigated?.total ?? 0,
            byDamageType: { ad: 0, ap: 0, true: 0, ...statistics?.damage?.mitigated?.byDamageType },
            byStatusEffect: statistics?.damage?.mitigated?.byStatusEffect ?? {},
        },
    },
    healing: {
        byBasicAttack: statistics?.healing?.byBasicAttack ?? 0,
        bySkill: statistics?.healing?.bySkill ?? [],
        prevented: statistics?.healing?.prevented ?? 0,
        hpRegenerated: statistics?.healing?.hpRegenerated ?? 0,
    },
    resources: {
        manaSpent: 0,
        manaRegenerated: 0,
        manaDrained: 0,
        manaRestored: 0,
        ...statistics?.resources,
    },
    actions: {
        turnsPlayed: 0,
        basicAttacksUsed: 0,
        skillsUsed: 0,
        skippedTurns: 0,
        skippedByStun: 0,
        ...statistics?.actions,
    },
    hits: {
        attempted: 0,
        successful: 0,
        missed: 0,
        dodged: 0,
        blocked: 0,
        reflected: 0,
        critical: 0,
        penetrating: 0,
        doubleHitsTriggered: 0,
        ...statistics?.hits,
    },
    effects: {
        appliedByType: statistics?.effects?.appliedByType ?? {},
        receivedByType: statistics?.effects?.receivedByType ?? {},
        resistedByType: statistics?.effects?.resistedByType ?? {},
    },
});
