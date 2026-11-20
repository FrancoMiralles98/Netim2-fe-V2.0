# Animaciones visuales compartidas

Guardar cada efecto reutilizable en su propia carpeta y exportarlo desde `index.ts`.

## SpritesheetEffect

Reproductor de una secuencia de fotogramas con transparencia. Usa Web Animations
para seleccionar cada celda mediante `background-position`, respetando pausa
y cambios de velocidad. Recorre las filas de izquierda a derecha y termina
ocultándose. Cambiá la `key` para reproducir otra ejecución de la misma skill.

```tsx
import { SpritesheetEffect } from "./shared/animations";

// Mantener la configuración estable, fuera del componente.
const dragon = {
    src: "/spritesheets/dragon-fire-41.webp",
    columns: 6,
    rows: 4,
    frameCount: 24,
    fps: 24,
};

<div className="pointer-events-none h-64 w-64">
    <SpritesheetEffect
        key={castId}
        sheet={dragon}
        speed={speed}
        paused={isPaused}
    />
</div>
```

El contenedor define el tamaño y la posición. Cada celda debe tener el mismo
tamaño y la misma relación de aspecto que ese contenedor. Se requieren valores
positivos para columnas, filas, fotogramas, FPS y velocidad, y una cuadrícula
con capacidad para todos los fotogramas. También acepta `className` y `style`.
Con movimiento reducido, el efecto se oculta.

Para efectos persistentes, `<SpritesheetEffect sheet={sheet} loop />` repite
la secuencia hasta que el componente se desmonta. Conserva pausa y velocidad.
El modo predeterminado reproduce una sola vez y termina oculto.

`direction="alternate"` recorre los cuadros hacia adelante y después hacia
atrás, omitiendo la repetición de los extremos: 1→…→24→23→…→2→1.
Combinado con `loop` repite ese recorrido mientras el componente esté montado.
Los 24 cuadros a 24 FPS producen un ciclo completo de unos 1,92 segundos.

### Auras persistentes

`AuraEffectConfig` admite 24 o 36 fotogramas. Las nuevas auras de 36 cuadros
usan 24 FPS y `direction: "normal"` para completar un ciclo continuo de
1,5 segundos. El primer y el último cuadro son distintos y la transición
del último al primero forma parte del movimiento. La distribución en
filas/columnas puede variar. Los efectos puntuales de skills conservan sus
configuraciones de 24 cuadros.

Con `direction: "alternate"`, el reproductor cambia de sentido y cada extremo
ocupa un solo intervalo de fotograma:

```text
… 22 → 23 → 24 → 23 → 22 …
…  3 →  2 →  1 →  2 →  3 …
```

La secuencia alternada tiene 46 pasos por ciclo (24 de ida y 22 de vuelta).
A 24 FPS dura 46/24 segundos, aproximadamente 1,92 segundos.

`getAuraEffect(skillId)`, en `src/features/fight/animations/aura-effects.ts`,
registra las spritesheets que se repiten mientras están en `activeAuras`.
La skill 42 usa `/spritesheets/dragon-strength-aura-42.webp`, con 36 cuadros
a 24 FPS y un ciclo de 1,5 segundos en dirección normal. La esfera celeste
mantiene su posición, tamaño y contorno; el interior cambia suavemente de luz
mientras los aros dorados y violetas oscilan alrededor. El WebP sin pérdida
mide 4800×2640 px, con 6×6 celdas de 800×440 px a resolución doble.
La referencia visual es una superficie de 400×220 px con la card de 257×60 px
en x=50, y=80, y la esfera centrada en x=303, y=80, junto a la esquina superior
derecha. `cardBounds` mantiene esa ubicación con el tamaño real de la card.

La skill 43 usa `/spritesheets/blessing-arc-aura-43.webp`, con
36 fotogramas a 24 FPS y `direction: "normal"`. Las siluetas puntiagudas
azules y las esferas celestes forman dos arcos laterales abiertos.
El centro queda transparente. El diseño generado tiene una oscilación
periódica mínima y brillo escalonado; la transición 36→1 continúa el ciclo.
El primer y último cuadro son distintos. El ciclo dura 1,5 segundos a
velocidad normal. Se muestra sobre la card del lanzador.
El recurso WebP sin pérdida mide 4800×2880 px, con una cuadrícula de 6×6.
Cada celda de 800×480 px corresponde a una superficie de 400×240 px
a resolución doble. La card de referencia mide 257×60 px y ocupa
x=71,5, y=90 dentro de esa superficie. `cardBounds` conserva esta alineación
con las dimensiones reales de la card. El margen transparente mantiene
visibles el resplandor y los extremos de ambos arcos.

La skill 44 usa `/spritesheets/golden-aura-44.webp`, con 36 cuadros a 24 FPS
y `direction: "normal"`. El aura amarilla se dibuja por delante de la card.
El WebP sin pérdida mide 4524×2040 px, distribuido en 6×6 celdas de 754×340 px.
Cada celda se diseñó a resolución doble para una superficie de 377×170 px
con una card de 257×60 px ubicada en x=61, y=53.
`cardBounds` expresa ese rectángulo en coordenadas normalizadas. La capa
calcula el tamaño y desplazamiento de la celda a partir de las dimensiones
reales de la card, para mantener alineada el aura al contraer o expandir.

`FightAuraEffects` renderiza las auras registradas cuyo `sourceFighterId`
coincide con el luchador de la card. `aura_activated` la incorpora al estado.
`aura_duration_updated` con duración cero o `aura_deactivated` la retiran.
Reset vacía el estado y retira la animación. La duración es la del estado de
la pelea; la duración del ciclo solo define cuánto dura cada vuelta visual.
Agregar una entrada en `AURA_EFFECTS` habilita otro efecto persistente.

`frameWeights` permite repartir el tiempo entre cuadros. Es un array de
pesos positivos, uno por fotograma. Por defecto todos pesan 1. Un peso 2
asigna el doble de tiempo a ese cuadro. La duración total sigue siendo
`frameCount / fps`. Los pesos inválidos o ausentes se consideran 1.

En las peleas, `getSkillEffect(skillId)`, definido en
`src/features/fight/animations/skill-effects.ts`, obtiene la configuración.
Agregá una entrada al registro para habilitar otra skill. La configuración
incluye `mode: "target" | "projectile"`, tamaño visual (`width`, `height`)
y anclaje normalizado (`anchorX`, `anchorY`, entre 0 y 1).

- `target` coloca la secuencia sobre la card objetivo.
- `projectile` comienza en la card del lanzador y viaja hasta la card objetivo.
  Llega al 80 % del tiempo total y reproduce la parte final en el destino.

La skill 39 usa el dragón horizontal en modo `projectile`, con 24 cuadros a
16 FPS (1,5 segundos). Los primeros cuatro cuadros forman la cabeza en el
lanzador y los últimos cuadros muestran el destello/explosión sobre el objetivo.
`launchFraction` configura qué fracción inicial permanece en el lanzador
(4/24 para la skill 39). La skill 41 usa la columna en modo `target`,
con 1,5 segundos de duración y pesos dobles en los cuadros 9–16 para
mantener visible el dragón a máxima altura durante 0,75 segundos.

La skill 40, Talismán volador, usa `flying-talisman-40.webp` en modo
`projectile`: aura verde inicial, esfera azul con corona dorada, pequeños
talismanes verdes en la estela y explosión azul/verde/dorada al llegar.
Tiene 24 cuadros a 16 FPS y dura 1,5 segundos. Los primeros cuatro cuadros
se reproducen en el lanzador antes de iniciar el desplazamiento.
El recurso usa WebP sin pérdida con transparencia.
Podés cambiar el modo por skill en el registro o mediante la prop opcional
de `FightPlayback`:

```tsx
<FightPlayback
    response={response}
    onFinishFight={onFinishFight}
    skillEffectModes={{ 39: "target" }}
/>
```

`getSkillEffect(39, "target")` también obtiene la configuración con el modo
indicado. Cambiar el modo conserva el recurso gráfico de esa skill.

La capa `SkillEffectLayer` vive sobre todo el campo de batalla. Mide las cards
identificadas por `data-fight-fighter-id` y actualiza las coordenadas al cambiar
el tamaño o el scroll. Acepta `mode`, `paused` y `speed`. La trayectoria y los
fotogramas responden a los controles del playback.

Durante `action_selected`, las acciones `use_damage_skill` seleccionan como
destino la card atacada. Las demás acciones con `skillId` seleccionan al
lanzador. El playback espera la duración completa de la secuencia
antes del siguiente evento. Reset y desmontaje retiran el efecto.

La spritesheet de la habilidad 41 tiene 24 cuadros de 256×256 px en una imagen
de 1536×1024 px. `dragon-fire-41-clean.webp` usa WebP sin pérdida y conserva
el canal alfa. Se limpiaron los halos amplios y los recuadros laterales.
Es la resolución nativa del recurso generado. Ampliarlo no agregaría detalle.

La spritesheet horizontal de la skill 39 usa WebP con transparencia, cuadrícula
4×6 y celdas de 448×256 px en `dragon-projectile-39-v2.webp`. Incluye márgenes
transparentes para el estallido final. Se generó con IA usando la imagen de referencia
del dragón amarillo horizontal. El prompt está en
`public/spritesheets/dragon-projectile-39-prompt.md`.

## ItemBorderGlint

Chispa blanca con halo y estela dorada que recorren el borde del ítem en
sentido horario. La animación está hecha en CSS y el componente React se
exporta desde `index.ts`.

```tsx
import { ItemBorderGlint } from "./shared/animations";

<div className="relative isolate h-32 w-16 rounded-lg border border-amber-900">
    <img src="/items/100.png" alt="Espada" className="h-full w-full object-contain" />
    <ItemBorderGlint />
</div>
```

El contenedor debe tener posición relativa y definir el borde. Usá `radius`
para igualar sus esquinas en píxeles (8 por defecto, 0 para esquinas rectas).
`duration` fija los segundos por vuelta (2,88 por defecto). También acepta
`className`, `style` y `paused`. El halo se puede extender fuera del borde si
el contenedor permite desbordamiento visible.

El efecto no intercepta clics. Con `paused` se congela en la posición actual,
y con la preferencia de movimiento reducido se muestra fijo.

### Dorado y azul

```tsx
<ItemBorderGlint variant="gold" />
<ItemBorderGlint variant="blue" />
```

Ambas opciones comparten la animación, velocidad, longitud de estela y tamaño
del destello. `blue` usa una estela azul con halo celeste y centro blanco.
El dorado es el valor predeterminado. Podés cambiar `variant` durante el
renderizado para seleccionar el color.

### Variante roja intensa

```tsx
<ItemBorderGlint variant="red" />
```

Usa el mismo recorrido con una estela roja más larga y un halo más intenso.
Las chispas salen hacia afuera al paso del destello y se desvanecen. Para ver
su recorrido completo, dejá el desbordamiento visible en el contenedor del ítem.
Con movimiento reducido, las chispas se ocultan. El estilo dorado es el valor
predeterminado (`variant="gold"`).

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

## PortalVortex

Remolino rojo y violeta con puntas afiladas y destellos blancos que entran
desde el borde y se apagan al acercarse al centro. El fondo del efecto es
transparente.

```tsx
import { PortalVortex } from "./shared/animations";

<PortalVortex className="max-w-80" />
```

Acepta `className`, `style` y `paused`. Cada instancia visible comparte el
mismo fotograma de 340 × 340, con un máximo de 30 FPS. Si la pestaña está oculta
o el componente queda fuera de pantalla, deja de animarse. Con movimiento
reducido o `paused` muestra un fotograma estático. No intercepta clics ni
requiere dependencias adicionales.
