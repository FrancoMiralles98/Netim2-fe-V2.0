export interface EffectPoint {
    x: number;
    y: number;
}

export const getProjectileKeyframes = (
    source: EffectPoint,
    target: EffectPoint,
    launchFraction = 0,
): Keyframe[] => [
    { transform: `translate(${source.x}px, ${source.y}px)`, offset: 0 },
    { transform: `translate(${source.x}px, ${source.y}px)`, offset: launchFraction },
    { transform: `translate(${target.x}px, ${target.y}px)`, offset: 0.8 },
    { transform: `translate(${target.x}px, ${target.y}px)`, offset: 1 },
];

export const getProjectileAngle = (source: EffectPoint, target: EffectPoint): number =>
    Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
