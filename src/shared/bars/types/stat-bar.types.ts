export interface StatBarProps {
    label?: import('react').ReactNode;
    valueLabel?: string;
    texture?: 'vit' | 'int' | 'str' | 'dex' | 'ad' | 'ap' | 'extra' | 'stats';
    name: 'VIT' | 'INT'  | 'STR' | 'DEX' ;
    value: number;
    maxValue?: number;
    isActive: boolean;
     animationKey?: string;
}
