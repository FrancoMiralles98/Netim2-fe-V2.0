export const CHARACTER_SKILLS_ROUTES = {
    upgrade: (characterId: string) => `character/${characterId}/skills/upgrade`,
    upgradePreview: (characterId: string) => `character/${characterId}/skills/upgrade-preview`,
    specialityPreview: (characterId: string) => `character/${characterId}/skills/speciality-preview`,
    selectSpeciality: (characterId: string) => `character/${characterId}/skills/select-speciality`,
};
