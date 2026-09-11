import type { FightPlaybackSpeed } from "../../../animations/use-fight-play-back.type";

export interface SpeedButtonProps {
    value: FightPlaybackSpeed;

    currentSpeed: FightPlaybackSpeed;

    disabled: boolean;

    onChange: (
        speed: FightPlaybackSpeed
    ) => void;
}

export const SpeedButton = ({
    value,
    currentSpeed,
    disabled,
    onChange
}: SpeedButtonProps) => {

    const isActive =
        currentSpeed === value;

    return (
        <button
            type="button"
            onClick={() =>
                onChange(value)
            }
            disabled={disabled}
            className={`
                rounded
                px-2
                py-1
                text-white

                transition-colors

                disabled:cursor-not-allowed
                disabled:opacity-40

                ${
                    isActive
                        ? 'bg-blue-600 hover:bg-blue-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                }
            `}
        >
            x{value}
        </button>
    );
};