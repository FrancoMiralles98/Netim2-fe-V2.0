import "./item-border-glint.css";

const START_PHASE = 0.18;
const SPARK_COUNT = 24;

const createTrail = (count, fraction) => Array.from({ length: count }, (_, index) => {
    const progress = index / count;

    return {
        "--item-border-glint-phase": (1 + START_PHASE - progress * fraction) % 1,
        opacity: (1 - progress) ** 1.35,
    };
});

const goldTrail = createTrail(24, 0.28);
const redTrail = createTrail(32, 0.35);

const sparks = Array.from({ length: SPARK_COUNT }, (_, index) => {
    const birth = index / SPARK_COUNT;

    return {
        "--item-border-glint-birth": `${birth * 100}%`,
        "--item-border-glint-phase": (1 + START_PHASE - birth) % 1,
        "--item-border-glint-spark-size": `${3 + (index * 3) % 5}px`,
        "--item-border-glint-spark-back": `-${4 + (index * 7) % 15}px`,
        "--item-border-glint-spark-out": `-${12 + (index * 13) % 23}px`,
    };
});

/** Decorative overlay for a positioned item slot. */
export const ItemBorderGlint = ({
    className = "",
    style,
    paused = false,
    duration = 2.88,
    radius = 8,
    variant = "gold",
}) => (
    <span
        aria-hidden="true"
        className={`item-border-glint ${className}`}
        data-paused={paused}
        data-variant={variant}
        style={{
            "--item-border-glint-duration": `${duration}s`,
            "--item-border-glint-radius": `${radius}px`,
            "--item-border-glint-phase": START_PHASE,
            ...style,
        }}
    >
        {(variant === "red" ? redTrail : goldTrail).map((segmentStyle, index) => (
            <span
                key={index}
                className="item-border-glint__runner item-border-glint__trail"
                style={segmentStyle}
            />
        ))}
        {variant === "red" && sparks.map((sparkStyle, index) => (
            <span
                key={index}
                className="item-border-glint__runner item-border-glint__emitter"
                style={sparkStyle}
            >
                <span className="item-border-glint__spark" />
            </span>
        ))}
        <span className="item-border-glint__runner item-border-glint__tip" />
    </span>
);
