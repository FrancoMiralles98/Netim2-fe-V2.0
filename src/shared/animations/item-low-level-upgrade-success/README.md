# ItemLowLevelUpgradeSuccessEffect

Este componente es ahora el acceso directo al **final exitoso**, reutilizando
la preparación de `ItemLowLevelUpgradeEffect`. Conserva sus propiedades y su
duración original. El destello y descenso viven separados en `success-ending.ts`.
Para empezar sin conocer el resultado y luego elegir éxito o rotura sin
reiniciar, ver [la API compartida](../item-low-level-upgrade/README.md).

Animación para celebrar una **mejora exitosa de nivel bajo** en el herrero,
basada en la vista previa aprobada. El ítem se eleva, su silueta se vuelve
blanca, absorbe pequeños destellos, emite un flash localizado y baja a su
posición inicial. Al terminar conserva la imagen recibida en `src`.

Reproducila únicamente después de que el backend confirme el éxito y el
consumidor determine que la mejora corresponde al rango de nivel bajo. El
componente no fija un rango numérico ni decide el resultado. No se usa para
mostrar un intento pendiente, una mejora fallida o una mejora de nivel alto.

## Uso

```tsx
import { ItemLowLevelUpgradeSuccessEffect } from "../../../shared/animations";

<ItemLowLevelUpgradeSuccessEffect
    key={successfulLowLevelUpgradeId}
    src="/items/200.png"
    alt="Arma mejorada con éxito en nivel bajo"
    width={64}
    height={192}
    onComplete={() => setIsAnimating(false)}
/>
```

Ajustá la ruta del import a la ubicación del consumidor. El componente **incluye
la imagen**: reemplazá la imagen del ítem en la forja, en lugar de superponerlo
sobre otra copia. No incluye escenario, yunque, botones, sonido ni fondo.

Usá una `key` diferente por mejora exitosa de nivel bajo para repetir el efecto
sobre el mismo ítem.
Los renders normales y los cambios de identidad de `onComplete` no lo reinician.
Cambiar `src`, `duration` o `liftDistance` inicia una nueva secuencia. Cambiar
`width`, `height`, `className` o `style` adapta la presentación sin reiniciarla.

Después de confirmar el éxito de nivel bajo, activá la secuencia con
`active={showLowLevelUpgradeSuccess}`. El cambio de `false` a `true` comienza
desde cero; volver a `false` cancela y restaura la imagen, sin llamar a
`onComplete`. Para congelar y continuar usá `paused`.

```tsx
<ItemLowLevelUpgradeSuccessEffect
    src={item.img}
    alt={item.name}
    active={showLowLevelUpgradeSuccess}
    paused={isPaused}
    duration={3550}
    liftDistance={32}
    onComplete={handleVisualComplete}
    onError={handleImageError}
/>
```

## Propiedades

| Propiedad | Tipo | Predeterminado | Función |
| --- | --- | --- | --- |
| `src` | `string` | Obligatoria | URL de la imagen del ítem. |
| `alt` | `string` | Obligatoria | Texto alternativo de la única imagen accesible. |
| `width` | `number` | `64` | Ancho del espacio del ítem, en píxeles CSS. |
| `height` | `number` | `192` | Alto del espacio del ítem, en píxeles CSS. |
| `duration` | `number` | `3550` | Duración total en milisegundos; escala todas las fases. |
| `liftDistance` | `number` | `32` | Elevación en píxeles CSS; admite `0`. |
| `active` | `boolean` | `true` | Activa la celebración del éxito de nivel bajo; `false` muestra el ítem estático. |
| `paused` | `boolean` | `false` | Congela y reanuda sin perder el progreso. |
| `className` | `string` | `""` | Clases del contenedor. |
| `style` | `CSSProperties` | — | Estilos del contenedor; prevalecen sobre ancho/alto. |
| `onComplete` | `() => void` | — | Una llamada al finalizar cada ejecución. |
| `onError` | `ReactEventHandler<HTMLImageElement>` | — | Error de carga de la imagen principal. |

Ancho, alto y duración deben ser finitos y positivos. Los valores numéricos
inválidos usan sus predeterminados. La elevación debe ser finita y no negativa.

## Tiempos de referencia

Con `duration={3550}`:

| Tiempo | Acción |
| --- | --- |
| 0–180 ms | Ítem en reposo. |
| 180–830 ms | Elevación suave de 32 px. |
| 580–2610 ms | 46 partículas deterministas convergen hacia el ítem. |
| 600–2150 ms | La silueta se vuelve blanca progresivamente. |
| 2300–2540 ms | Flash blanco breve y localizado sobre el ítem. |
| 2500–3020 ms | Se apagan los últimos brillos y el blanqueado. |
| 2620–3340 ms | Descenso suave hasta la posición original. |
| 3550 ms | Limpieza de las capas y llamada a `onComplete`. |

Las fases se superponen para evitar cortes. Las partículas mantienen la
distribución de la muestra y escalan según el tamaño visible de la imagen.

## Integración y comportamiento

- El contenedor reserva el tamaño del ítem sin mover el resto del layout. Solo
  la imagen y su silueta blanca se elevan. No agregues un `transform` a la capa
  interna `.item-low-level-upgrade__moving`.
- Dejá espacio arriba y a los costados. El contenedor permite desbordamiento;
  un ancestro con `overflow: hidden` o `overflow: clip` recortará el movimiento
  y los destellos. Los estilos externos pueden adaptar el tamaño, por ejemplo
  `style={{ width: "100%", height: "100%" }}` dentro de un slot dimensionado.
- Usá un PNG/WebP con transparencia. La capa blanca respeta el alfa; una imagen
  con un fondo opaco también blanqueará ese fondo. No se modifican los archivos
  originales ni se leen sus píxeles desde canvas.
- La reproducción espera la carga de la imagen. Si falla, llama al `onError`
  de la imagen principal y no a `onComplete`; el consumidor debe resolver ese
  estado. `onComplete` tampoco se ejecuta al cancelar o desmontar.
- Al ocultar la pestaña, el reloj se suspende y continúa al volver. `paused`
  conserva tanto la posición como los brillos. El tiempo de carga y el tiempo
  de pausa no cuentan en `duration`.
- Con `prefers-reduced-motion: reduce` mantiene la imagen estática y omite
  desplazamiento, blanqueado, partículas y flash. Notifica `onComplete` en el
  siguiente fotograma disponible después de cargar la imagen y estar activo,
  sin pausa y con la pestaña visible. La preferencia se escucha en vivo.
- La capa blanca y el canvas son decorativos y no se anuncian. El efecto no
  intercepta clics. Usa `alt` para nombrar el ítem; anunciá el resultado real
  desde la interfaz del herrero, si corresponde.
- El canvas tiene fondo transparente, ajusta su resolución hasta DPR 2 y se
  redimensiona con `ResizeObserver`. Si canvas 2D no está disponible, conserva
  elevación, blanqueado y finalización, sin partículas.
- El desmontaje cancela `requestAnimationFrame`, desconecta el observador y
  retira los listeners de carga, error, visibilidad y movimiento reducido.

La secuencia es **visual**: celebra un éxito ya confirmado, no hace peticiones,
no consume materiales, no cobra yang y no determina rotura ni estadísticas.
La lógica del herrero debe confirmar el resultado con el backend y seleccionar
esta animación solo para mejoras exitosas de nivel bajo. `onComplete` indica
que terminó la celebración; no confirma ni aplica la mejora. Pasá en `src` la
imagen que deba mostrarse al terminar, normalmente la del ítem ya mejorado.

## Archivos

- `ItemLowLevelUpgradeSuccessEffect.tsx`: componente React, propiedades y ciclo de vida.
- `../item-low-level-upgrade/upgrade-renderer.ts`: reloj y preparación compartidos.
- `../item-low-level-upgrade/success-ending.ts`: final de éxito independiente.
- `../item-low-level-upgrade/item-low-level-upgrade.css`: capas y presentación.

Se exporta junto con `ItemLowLevelUpgradeSuccessEffectProps` desde `shared/animations/index.ts`.
No agrega dependencias. `ItemUpgradeSparkles` sigue siendo el efecto persistente
del equipo +9; este componente celebra una mejora exitosa de nivel bajo.
