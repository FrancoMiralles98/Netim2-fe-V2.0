import type { NpcShopId } from "netim2-shared";

export const tiendas = {
    general: { nombre: "Tienda General", icono: "/tiendas/icons/tienda-general.png" },
    weapons: { nombre: "Tienda de Armas", icono: "/tiendas/icons/tienda-armas.png" },
    armors: { nombre: "Tienda de Armaduras", icono: "/tiendas/icons/tienda-armaduras.png" },
    stable: { nombre: "Establo", icono: "/tiendas/icons/establo.png" },
    fishing: { nombre: "Tienda de Pesca", icono: "/tiendas/icons/pescador.png" },
} as const satisfies Record<NpcShopId, { nombre: string; icono: string }>;

export const esNpcShopId = (seccion: string): seccion is NpcShopId =>
    Object.hasOwn(tiendas, seccion);
