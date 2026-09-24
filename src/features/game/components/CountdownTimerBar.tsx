import { useEffect, useState } from "react";

interface CountdownTimerBarProps {
    endsAt: number;
    durationMs: number;
    label: string;
}

export const CountdownTimerBar = ({ endsAt, durationMs, label }: CountdownTimerBarProps) => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (endsAt <= Date.now()) return;

        const intervalId = window.setInterval(() => {
            const currentTime = Date.now();
            setNow(currentTime);

            if (currentTime >= endsAt) {
                window.clearInterval(intervalId);
            }
        }, 250);

        return () => window.clearInterval(intervalId);
    }, [endsAt]);

    const remainingMs = Math.max(0, endsAt - now);
    const isReady = remainingMs === 0;
    const percentage = durationMs > 0
        ? Math.min(100, Math.max(0, (1 - remainingMs / durationMs) * 100))
        : isReady ? 100 : 0;
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const text = isReady
        ? 'Listo para pelear'
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div
            className="relative h-5 min-w-0 w-full overflow-hidden rounded-sm border border-amber-200/50 bg-black/70"
            role="progressbar"
            aria-label={label}
            aria-valuenow={Math.round(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={text}
        >
            <div
                className={`h-full transition-[width] duration-300 ${isReady ? 'bg-green-700' : 'bg-red-700'}`}
                style={{ width: `${percentage}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[10px] font-semibold text-white [text-shadow:0_1px_2px_#000]">
                {text}
            </span>
        </div>
    );
};
