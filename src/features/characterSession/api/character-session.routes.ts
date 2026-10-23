export const CHARACTER_SESSION_ROUTES = {
    getCharacterSession: (id: string) => (
        `character/${id}`
    ),
    getGameConfig: () => 'game-data/config',
}
