/** Referencias visuales iniciales, editables; no modifican los cálculos de combate. */
export const SKILL_SCALING_REFERENCES = {
    damage: { flat: 3, increased: 0.1 },
    attribute: { flat: 10, increased: 0.4 },
    stat: { flat: 10, increased: 0.3 },
    lv: { damage: 200, stat: 20 },
};

export const SKILL_SCALING_RATINGS = [
    { ratio: 0.8, label: 'Muy alto' },
    { ratio: 0.6, label: 'Alto' },
    { ratio: 0.4, label: 'Moderado' },
    { ratio: 0.2, label: 'Bajo' },
    { ratio: 0, label: 'Muy bajo' },
] as const;
