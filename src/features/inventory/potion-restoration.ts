import type { CharacterSession, InventoryItem, PocionType, QuickHealResource } from "netim2-shared";

type Resources = CharacterSession["stats"]["general"];

export const getResourcesWithoutPotions = (
    inventory: InventoryItem[],
    resources: QuickHealResource[],
): QuickHealResource[] => resources.filter(resource => !inventory.some(item => {
    if (item.type !== "utility" || item.type_utility !== "poción" || item.cantidad <= 0) return false;

    if (item.potionType === "reserve") {
        return item.reserve.actual > 0 && item.resource.includes(resource);
    }

    return item.effect.some(effect => effect.resource === resource && effect.amount > 0);
}));

export const canPotionRestore = (potion: PocionType, resources: Resources): boolean => {
    const needsRecovery = (resource: "hp" | "mana") =>
        resources[resource].actual < resources[resource].max;

    if (potion.potionType === "reserve") {
        return potion.reserve.actual > 0 && potion.resource.some(needsRecovery);
    }

    return potion.effect.some(effect => effect.amount > 0 && needsRecovery(effect.resource));
};
