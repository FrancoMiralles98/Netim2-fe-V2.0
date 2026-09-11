import type { FightPlaybackSpeed } from "../../animations/use-fight-play-back.type";
import { SpeedButton } from "./button/SpeedButton";

interface FightPlaybackControlsProps {
    loadingFight: boolean;
    fightReady: boolean;

    isPlaying: boolean;
    isPaused: boolean;

    speed: FightPlaybackSpeed;

    onLoadFight: () => void;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;

    onChangeSpeed: (
        speed: FightPlaybackSpeed
    ) => void;
}

export const FightPlaybackControls = ({
    loadingFight,
    fightReady,

    isPlaying,
    isPaused,

    speed,

    onLoadFight,
    onPlay,
    onPause,
    onReset,

    onChangeSpeed
}: FightPlaybackControlsProps) => {

    return (
        <div
            className="
                flex
                items-center
                gap-2
            "
        >
            {/* Cargar pelea */}
            <button
                type="button"
                onClick={onLoadFight}
                disabled={
                    loadingFight ||
                    isPlaying
                }
                className="
                    rounded
                    bg-slate-700
                    px-3
                    py-1
                    text-white

                    transition-colors
                    hover:bg-slate-600

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:bg-slate-700
                "
            >
                {loadingFight
                    ? 'Cargando pelea...'
                    : 'Abrir'
                }
            </button>

            {/* Play / continuar */}
            <button
                type="button"
                onClick={onPlay}
                disabled={
                    !fightReady ||
                    (isPlaying && !isPaused)
                }
                className="
                    rounded
                    bg-green-700
                    px-3
                    py-1
                    text-white

                    transition-colors
                    hover:bg-green-600

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:bg-green-700
                "
            >
                {isPaused
                    ? 'Continuar'
                    : 'Play'
                }
            </button>

            {/* Pause */}
            <button
                type="button"
                onClick={onPause}
                disabled={
                    !isPlaying ||
                    isPaused
                }
                className="
                    rounded
                    bg-yellow-700
                    px-3
                    py-1
                    text-white

                    transition-colors
                    hover:bg-yellow-600

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:bg-yellow-700
                "
            >
                Pause
            </button>

            <SpeedButton
                value={1}
                currentSpeed={speed}
                disabled={!fightReady}
                onChange={onChangeSpeed}
            />

            <SpeedButton
                value={2}
                currentSpeed={speed}
                disabled={!fightReady}
                onChange={onChangeSpeed}
            />

            <SpeedButton
                value={4}
                currentSpeed={speed}
                disabled={!fightReady}
                onChange={onChangeSpeed}
            />

            {/* Reset */}
            <button
                type="button"
                onClick={onReset}
                disabled={
                    !fightReady ||
                    loadingFight
                }
                className="
                    rounded
                    bg-red-700
                    px-3
                    py-1
                    text-white

                    transition-colors
                    hover:bg-red-600

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:bg-red-700
                "
            >
                Reset
            </button>
        </div>
    );
};