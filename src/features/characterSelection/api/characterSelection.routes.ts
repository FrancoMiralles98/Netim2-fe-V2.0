export const CHARACTER_SELECTION_ROUTES = {
    characterSelectionData: () => (
        'game-data/character-selection-data'
    ),
    create: () => (
        'character/create'
    ),
    delete: (characterId: string) => (
        `character/delete/${characterId}`
    )
}