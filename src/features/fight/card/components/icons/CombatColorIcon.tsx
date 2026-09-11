export interface CombatColoredIconProps {
    src: string;
    critical?: boolean;
}

export const CombatColoredIcon = ({
    src,
    critical = false
}: CombatColoredIconProps) => {
    return (
        <span
            className={`
                inline-block
                shrink-0
                bg-current

                ${critical
                    ? 'h-6 w-6'
                    : 'h-5 w-5'
                }
            `}
            style={{
                maskImage: `url("${src}")`,
                WebkitMaskImage: `url("${src}")`,

                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',

                maskPosition: 'center',
                WebkitMaskPosition: 'center',

                maskSize: 'contain',
                WebkitMaskSize: 'contain'
            }}
        />
    );
};