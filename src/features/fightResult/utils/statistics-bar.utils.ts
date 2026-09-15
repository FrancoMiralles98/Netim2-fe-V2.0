import type {
    StatisticsBarSegment,
    StatisticsBarSegmentLayout
} from "../types/statistics-bar.types";

export const getStatisticsBarLayout = (
    value: number,
    segments: StatisticsBarSegment[],
    scaleTotal?: number
): StatisticsBarSegmentLayout[] => {
    if (value <= 0) {
        return [];
    }

    const visibleSegments = segments.filter(
        segment => segment.value > 0
    );

    const distributedTotal = visibleSegments.reduce(
        (total, segment) => total + segment.value,
        0
    );

    if (distributedTotal <= 0) {
        return [];
    }

    const percentageTotal =
        scaleTotal !== undefined && scaleTotal > 0
            ? scaleTotal
            : distributedTotal;

    return visibleSegments.map(segment => ({
        ...segment,
        percentage:
            Math.min(
                100,
                (segment.value / percentageTotal) * 100
            )
    }));
};

export const getPositiveSegments = (
    segments: StatisticsBarSegment[]
): StatisticsBarSegment[] => segments.filter(
    segment => segment.value > 0
);

export const getSegmentsTotal = (
    segments: StatisticsBarSegment[]
): number => segments.reduce(
    (total, segment) =>
        total + Math.max(0, segment.value),
    0
);

export const formatStatisticValue = (
    value: number
): string => new Intl.NumberFormat('es-AR').format(value);
