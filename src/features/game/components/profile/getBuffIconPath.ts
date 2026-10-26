import type { AppliedBuffos } from "netim2-shared";

const BUFF_ICON_GROUPS = [
    { ids: [36, 37], path: "/icons/buffs/Icono-daño.png" },
];

const BUFF_ICONS = new Map<number, string>(
    BUFF_ICON_GROUPS.flatMap(({ ids, path }) => ids.map(id => [id, path] as const)),
);

export const getBuffIconPath = (idBuff: AppliedBuffos["id_buff"]): string | null =>
    BUFF_ICONS.get(idBuff) ?? null;
