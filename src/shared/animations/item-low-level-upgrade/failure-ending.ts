import { clamp, ease } from "./upgrade-visuals";

const vertex = (column: number, row: number) => ({
    x: column * 25 + (column === 0 || column === 4 ? 0 : (column * 17 + row * 11) % 13 - 6),
    y: row * 20 + (row === 0 || row === 5 ? 0 : (column * 7 + row * 13) % 9 - 4),
});

/** Irregular triangles tile the full silhouette without gaps before breaking apart. */
export const FRAGMENTS = Array.from({ length: 40 }, (_, index) => {
    const cell = Math.floor(index / 2);
    const column = cell % 4;
    const row = Math.floor(cell / 4);
    const corners = [vertex(column, row), vertex(column + 1, row), vertex(column + 1, row + 1), vertex(column, row + 1)];
    const order = cell % 2 === 0 ? [[0, 1, 2], [0, 2, 3]] : [[0, 1, 3], [1, 2, 3]];
    const triangle = order[index % 2].map(corner => corners[corner]);
    return {
        cx: triangle.reduce((total, point) => total + point.x, 0) / 3,
        cy: triangle.reduce((total, point) => total + point.y, 0) / 3,
        clip: `polygon(${triangle.map(point => `${point.x}% ${point.y}%`).join(", ")})`,
        delay: (index * 13 % 9) / 100,
        dx: (column - 1.5) * 18 + (index * 17 % 23) - 11,
        dy: -15 - index * 7 % 30,
        rotation: (index * 31 % 150) - 75,
    };
});

interface FailureFrame {
    progress: number;
    silhouette: HTMLElement;
    intact: HTMLElement;
    cuts: HTMLElement[];
    fragments: HTMLElement;
    pieces: HTMLElement[];
    scale: number;
}

export const renderFailureEnding = ({ progress, silhouette, intact, cuts, fragments, pieces, scale }: FailureFrame) => {
    const heat = ease(progress / 0.3);
    const red = Math.round(255 - heat * 23);
    const green = Math.round(255 - heat * 164);
    const blue = Math.round(255 - heat * 222);
    silhouette.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    silhouette.style.filter = `drop-shadow(0 0 ${8 + heat * 3}px rgba(255,${Math.round(248 - heat * 158)},${Math.round(228 - heat * 208)},.8))`;
    silhouette.style.opacity = "1";
    cuts.forEach((cut, index) => {
        const reveal = ease((progress - 0.28 - index * 0.045) / 0.07);
        cut.style.top = `${18 + index * 16}%`;
        cut.style.opacity = String(reveal);
        cut.style.transform = `rotate(${index % 2 === 0 ? -27 : 24}deg) scaleX(${reveal})`;
    });
    const breaking = progress >= 0.53;
    intact.style.opacity = breaking ? "0" : "1";
    fragments.style.opacity = breaking ? "1" : "0";
    if (!breaking) return;
    pieces.forEach((piece, index) => {
        const fragment = FRAGMENTS[index];
        const travel = clamp((progress - 0.53 - fragment.delay) / (0.47 - fragment.delay));
        piece.style.opacity = String(1 - ease(travel));
        piece.style.transform = `translate(${fragment.dx * travel * scale}px, ${(fragment.dy * travel + 105 * travel * travel) * scale}px) rotate(${fragment.rotation * travel}deg) scale(${1 - travel * 0.8})`;
        const mask = piece.firstElementChild as HTMLElement;
        mask.style.backgroundColor = `rgb(${Math.round(232 - travel * 210)}, ${Math.round(91 - travel * 76)}, ${Math.round(33 - travel * 18)})`;
    });
};
