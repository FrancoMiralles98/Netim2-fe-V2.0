export interface StatBarProps {
    name: 'VIT' | 'INT'  | 'STR' | 'DEX' ;
    value: number;
    maxValue?: number;
    isActive: boolean;
     animationKey?: string;
}