export const CHARACTER_MISSIONS_ROUTES = {
    list: (characterId: string) => `character/${encodeURIComponent(characterId)}/missions`,
    claim: (characterId: string) => `character/${encodeURIComponent(characterId)}/missions/claim`,
};
