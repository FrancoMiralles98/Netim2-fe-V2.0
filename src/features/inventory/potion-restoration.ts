import type { CharacterSession, PocionType } from "netim2-shared";

type Resources = CharacterSession["stats"]["general"];

export const canPotionRestore = (potion: PocionType, resources: Resources): boolean => {
    const needsRecovery = (resource: "hp" | "mana") =>
        resources[resource].actual < resources[resource].max;

    if (potion.potionType === "reserve") {
        return potion.reserve.actual > 0 && potion.resource.some(needsRecovery);
    }

    return potion.effect.some(effect => effect.amount > 0 && needsRecovery(effect.resource));
};
