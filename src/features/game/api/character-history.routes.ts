export const CHARACTER_HISTORY_ROUTES = {
    claim: (characterId: string) => `character/${encodeURIComponent(characterId)}/historial/claim`,
    list: (characterId: string) => `historial/${encodeURIComponent(characterId)}/partials`,
    detail: (characterId: string, historialId: string) =>
        `historial/${encodeURIComponent(characterId)}/${encodeURIComponent(historialId)}`,
};
