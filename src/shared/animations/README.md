# Animaciones visuales compartidas

Guardar cada efecto reutilizable en su propia carpeta y exportarlo desde `index.ts`.

## ItemUpgradeSparkles

Efecto aprobado en la vista previa: 18 brillos blancos concentrados en una franja
central. Titilan varias veces mientras ascienden, con los mismos tamaños y
desplazamientos de la muestra. El ascenso y el titileo se reproducen al 49 % de
la velocidad original (dos reducciones sucesivas del 30 %), manteniendo las fases relativas de los
destellos. No requiere dependencias adicionales.

La franja mide como máximo 30 px de ancho y 130 px de alto; se adapta a ítems
pequeños sin superar el 40 % de su ancho ni su altura. No intercepta clics y se
oculta cuando el usuario prefiere movimiento reducido.

Uso sobre un ítem:

```tsx
import { ItemUpgradeSparkles } from "./shared/animations";

<div className="relative isolate h-32 w-16">
    <img src={item.img} alt={item.name} className="relative z-1 h-full w-full object-contain" />
    <ItemUpgradeSparkles />
</div>
```

Para dibujarlo debajo de la imagen, usar `layer="below"` y mantener la imagen
en `position: relative` con `z-index: 1`. El contenedor debe tener posición
relativa y dimensiones; `isolate` mantiene las capas dentro del ítem.

También acepta `paused`, `className` y `style`. Se aplica en el inventario y el
panel de equipo únicamente cuando `item.type === "equip"` y `item.upgradeLv === 9`.

## ItemStaticSparkles

Variante para equipo +8: 14 destellos fijos de color azul petróleo,
entre verde y azul oscuro. Aparecen y desaparecen sin desplazamiento, con el
titileo con ciclos un 50 % más largos que la variante anterior (aproximadamente
al 32,7 % de la velocidad original). Conserva los tamaños, posiciones y
tono de la vista previa, con un centro más luminoso y un halo reforzado,
ajustando la franja central al tamaño del ítem.

Se exporta desde `index.ts` y acepta las mismas propiedades y disposición de
capas que `ItemUpgradeSparkles`. No intercepta clics y se oculta con movimiento
reducido. Se aplica en inventario y panel de equipo cuando
`item.type === "equip" && item.upgradeLv === 8`.

### Variante bronce (+7)

`<ItemStaticSparkles variant="bronze" />` muestra seis brillos estáticos en
color bronce. Cada ciclo de parpadeo dura un 50 % más que el del +8.
Conserva la franja central, los tamaños y el halo. Se aplica en inventario y
panel de equipo cuando `item.type === "equip" && item.upgradeLv === 7`.

## ItemCorruptionSmoke

Humo rojo intenso (#e13030) persistente con remolinos lentos y bordes difusos,
basado en la vista previa aprobada. Se aplica en inventario y panel de equipo
cuando `item.corrupt === true`, para cualquier tipo de ítem y nivel de
mejora. Convive con los brillos de equipo +7, +8 y +9.

El contenedor del ítem debe ser relativo y aislado; el humo usa `z-index: 0`,
la imagen `z-index: 1` y los brillos `z-index: 2`. El humo ocupa toda la superficie
del ítem y se difumina únicamente cerca de los bordes, sin interceptar clics. Acepta `className`, `style` y
`paused`. Con movimiento reducido muestra un fotograma estático.

Todas las instancias comparten el cálculo de una textura de 128 × 184 a 22 FPS.
Solo se animan los ítems visibles y el render se suspende cuando la pestaña
está oculta o no quedan ítems visibles. No necesita dependencias adicionales.
