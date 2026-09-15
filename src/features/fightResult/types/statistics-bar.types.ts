export interface StatisticsBarSegment {
    key: string;
    value: number;
    label: string;
    colorClass: string;
    textColorClass?: string;
    icon?: string;
}

export interface StatisticsBarSegmentLayout
    extends StatisticsBarSegment {
    percentage: number;
}
