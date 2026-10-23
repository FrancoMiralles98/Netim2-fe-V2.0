import { IdItem, type InventoryItem } from "netim2-shared";

const ITEM_IMAGE_GROUPS = [
    { ids: [IdItem.ARMADURA_DE_MONJE], path: "/items/Armadura_de_Monje.png" },
    { ids: [IdItem.ESPADA], path: "/items/Icono_Espada.png" },
    { ids: [IdItem.GLAIVE], path: "/items/Icono_Glaive.png" },
    { ids: [IdItem.DAGA], path: "/items/Daga.png" },
    { ids: [IdItem.ESCUDO_DE_BATALLA], path: "/items/Escudo_de_Batalla.png" },
    { ids: [IdItem.CASCO_TRADICIONAL], path: "/items/Casco_tradicional.png" },
    { ids: [IdItem.PENDIENTES_DE_MADERA], path: "/items/Pendientes_de_Madera.png" },
    { ids: [IdItem.COLLAR_DE_MADERA], path: "/items/Collar_de_Madera.png" },
    { ids: [IdItem.BRAZALETE_DE_MADERA], path: "/items/Brazalete_de_Madera.png" },
    { ids: [IdItem.ZAPATILLAS_DE_CUERO], path: "/items/Zapatillas_de_cuero.png" },
    { ids: [IdItem.PIEDRA_DE_RAPIDEZ], path: "/items/Piedra_Rapidez.png" },
    { ids: [IdItem.PIEL_DE_LOBO], path: "/items/Piel_de_Lobo.png" },
    { ids: [IdItem.POCION_ROJA_P], path: "/items/Poción_Roja(P).png" },
    { ids: [IdItem.POCION_ROJA_M], path: "/items/Poción_Roja(M).png" },
    { ids: [IdItem.ROCIO_VERDE], path: "/items/Rocío_Verde.png" },
    { ids: [IdItem.CAJA_DE_HABILIDADES_DE_GUERRERO], path: "/items/Caja_Guerrero.png" },
    {
        ids: Array.from(
            { length: IdItem.LIBRO_DE_AURA_DE_ESPADA - IdItem.LIBRO_DE_CORTE_DE_TRES_MANERAS + 1 },
            (_, index) => IdItem.LIBRO_DE_CORTE_DE_TRES_MANERAS + index,
        ),
        path: "/items/Libro_Corporal.jpg",
    },
];

const ITEM_IMAGES = new Map<InventoryItem["idItem"], string>(
    ITEM_IMAGE_GROUPS.flatMap(({ ids, path }) => ids.map(id => [id, path] as const)),
);

export const getItemImagePath = (idItem: InventoryItem["idItem"]): string | null =>
    ITEM_IMAGES.get(idItem) ?? null;
