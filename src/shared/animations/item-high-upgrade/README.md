# ItemHighUpgradeEffect

Animación para **mejoras altas**, basada en la vista previa aprobada. El ítem
se eleva y vibra de menos a más mientras se vuelve blanco con tonalidad dorada.
Dos espirales luminosas lo envuelven por delante y por detrás; los destellos
que llegan hacia el ítem comienzan lentos y aceleran al acercarse el final.

El éxito libera una explosión dorada con una estrella central, **tres ondas
expansivas y 58 destellos** que se alejan. El ítem recupera su imagen original
y baja suavemente. El fallo reutiliza la rotura compartida de las variantes
anteriores, sin cambiarla.

No incluye el fondo ni el pedestal de la vista previa. El escenario lo aporta
la pantalla del herrero; el componente incluye la imagen del ítem y sus efectos.

## Uso

```tsx
import { ItemHighUpgradeEffect } from "../../../shared/animations";
import type { ItemHighUpgradeResult } from "../../../shared/animations";

// Empieza en "pending" y cambia cuando el backend confirma el resultado.
const visualResult: ItemHighUpgradeResult = upgradeResult;

<ItemHighUpgradeEffect
    key={upgradeAttemptId}
    src="/items/200.png"
    alt="Arma en la forja"
    result={visualResult}
    onComplete={handleVisualComplete}
    onError={handleImageError}
/>
```

Ajustá la ruta del import a la ubicación del consumidor. Mantené la misma
`key` y `src` durante el intento; cambiá **solo `result`** para elegir el final
sin reiniciar la animación. Para repetir el intento, cambiá la `key`.

## Resultados

- `pending` (predeterminado): completa la carga y espera con el ítem elevado,
  blanco/dorado y vibrando. El remolino y los destellos continúan a una velocidad
  acotada; ni el tamaño ni la aceleración crecen indefinidamente.
- `success`: al terminar la carga, o inmediatamente si ya estaba esperando,
  libera la explosión de luces y ondas. Detiene la vibración y baja el ítem.
- `failure`: detiene vibración y remolino, y reproduce el final compartido de
  rojo/anaranjado, cortes oscuros y fragmentación hasta desaparecer.
- `protected-failure`: detiene la carga y reproduce el final de fallo sin
  rotura: naranja, destello central blanco y chispas que saltan en arcos.
  Recupera el color original y baja conservando el ítem intacto.

Si el resultado llega antes de completar la preparación, se guarda hasta que
termine. Al comenzar el final queda fijado; cambios posteriores se ignoran.
`onComplete` se ejecuta una sola vez al terminar, nunca por entrar en espera.

El rango de nivel alto lo define la lógica del herrero. `failure` representa
**rotura confirmada** por el backend: no usar para fallos protegidos que
conservan el objeto. La animación no determina probabilidades ni resultado.

Para esos fallos protegidos usá `protected-failure`. Su final dura 4300 ms por
defecto, o 7900 ms con la preparación alta y sin espera. Ver
[el final sin rotura](../item-upgrade-protected-failure/README.md).

Para un resultado ya conocido, usá `result="success"`, `result="failure"` o `result="protected-failure"`
desde el comienzo. Se reproduce la secuencia completa, incluida la carga.

## Propiedades

| Propiedad | Predeterminado | Función |
| --- | --- | --- |
| `src: string` | Obligatoria | Imagen del ítem, preferentemente PNG/WebP transparente. |
| `alt: string` | Obligatoria | Texto alternativo de la imagen principal. |
| `result: ItemHighUpgradeResult` | `"pending"` | `"pending"`, `"success"`, `"failure"` o `"protected-failure"`. |
| `width`, `height` | `64`, `192` | Espacio reservado en píxeles CSS. |
| `preparationDuration` | `3600` | Duración de la preparación, en ms. |
| `endingDuration` | `2200` en éxito / `1850` en rotura / `4300` en fallo protegido | Duración del final seleccionado, en ms. |
| `liftDistance` | `36` | Elevación en píxeles CSS; admite `0`. |
| `active` | `true` | `false` cancela y restaura la imagen sin llamar a `onComplete`. |
| `paused` | `false` | Congela el ítem, remolino, vibración y partículas. |
| `className`, `style` | — | Presentación del contenedor; `style` prevalece sobre su tamaño. |
| `onComplete` | — | Callback al finalizar la presentación del resultado. |
| `onError` | — | Error de carga de la imagen; no se llama a `onComplete`. |

Ancho, alto y duraciones deben ser finitos y positivos. Elevación debe ser
finita y no negativa. Los valores inválidos usan los predeterminados del nivel
alto. No se agregan dependencias.

Cambiar `src`, duración de preparación, duración del final o elevación reinicia
la secuencia. Cambiar el resultado, pausa, tamaño o callbacks no la reinicia.
Activar después de `active={false}` comienza desde cero.

## Tiempos predeterminados

| Fase | Tiempo |
| --- | --- |
| Elevación | 180–930 ms desde el inicio. |
| Remolino | Aparece gradualmente desde 180 ms; aumenta su giro durante la carga. |
| Blanqueado dorado | 400–2500 ms desde el inicio. |
| Vibración y atracción | Aumentan durante los 3600 ms de carga. |
| Espera opcional | Hasta recibir el resultado, sin consumir tiempo del final. |
| Destello principal de éxito | 0–380 ms desde el comienzo del final. |
| Ondas expansivas | Tres ondas escalonadas cada 150 ms; desaparecen antes de 1250 ms. |
| Explosión de partículas | Salen hacia afuera durante unos 700 ms y se apagan antes de 1920 ms. |
| Descenso exitoso | 400–1650 ms desde el comienzo del final. |
| Finalización exitosa | 2200 ms desde el comienzo del final. |
| Rotura | 1850 ms desde el comienzo del final, igual que en las otras variantes. |

Sin espera, el éxito dura **5800 ms** y el fallo con rotura **5450 ms**.
Las duraciones personalizadas escalan cada fase completa, conservando sus
proporciones. La aceleración depende del progreso de carga, no de los FPS.

Para un ítem de 64×192 px, la vibración alcanza aproximadamente ±3,3 px
horizontales, ±1,8 px verticales y ±1,55° de rotación. Estos desplazamientos y
los efectos luminosos escalan según la altura visible de la imagen; la
elevación sigue expresándose en píxeles CSS configurables.

## Integración y accesibilidad

- La imagen está incluida: reemplazá la imagen del slot por este componente,
  sin superponer otra copia. El slot conserva su tamaño; no mueve el layout.
- Hay dos canvas transparentes: uno detrás del ítem para las ondas posteriores
  y los destellos entrantes, y otro delante para las ondas frontales, núcleo
  y explosión. No se leen píxeles para éxito o rotura ni se modifica el asset
  original. El final protegido muestrea el alfa en un canvas aislado y usa
  posiciones alternativas si no dispone de acceso a los píxeles.
- Dejá desbordamiento visible en los ancestros y espacio alrededor para no
  recortar elevación, remolino, partículas u ondas de la explosión.
- El fondo es transparente. No intercepta clics; las capas decorativas se
  ocultan a lectores de pantalla y la imagen principal conserva `alt`.
- Espera la carga de la imagen. Un error llama a `onError`; el consumidor debe
  resolver ese estado. Desactivar o desmontar tampoco dispara `onComplete`.
- Pausa y pestaña oculta detienen todo el reloj. Al volver, continúa sin saltar
  fases. Mientras espera resultado mantiene fotogramas para la vibración y las
  ondas, con un número acotado de partículas activas.
- Con `prefers-reduced-motion: reduce` omite elevación, vibración, rotación,
  ondas, destellos y fragmentos. Espera el resultado y aplica el estado final
  sin animación: conserva el ítem en éxito o fallo protegido y lo oculta en rotura, notificando
  `onComplete` una vez al estar cargado, activo, sin pausa y en pestaña visible.
  No queda un bucle de render activo durante la espera con esa preferencia.
- Tras rotura el ítem permanece oculto incluso al redimensionar. El consumidor
  debe aplicar el inventario confirmado. `active={false}` restaura la imagen
  porque es cancelación/reinicio, no una forma de conservar el estado roto.
- Sin canvas 2D conserva movimiento, color y rotura DOM, pero omite los efectos
  luminosos dibujados en canvas. Si solo falta el contexto posterior, ese pase
  usa el frontal como alternativa.
- El desmontaje cancela fotogramas, desconecta `ResizeObserver` y retira los
  listeners. Ambos canvas se redimensionan con el contenedor, hasta DPR 2.

El efecto presenta el resultado del servidor. No consume yang o materiales,
no aplica estadísticas y no decide protección contra rotura. No reemplaza los
brillos persistentes que se muestran sobre los ítems del inventario.

## Archivos

- `ItemHighUpgradeEffect.tsx`: componente React y tipos públicos.
- `high-charge.ts`: vibración, remolino y partículas entrantes aceleradas.
- `high-success-ending.ts`: estrella, explosión de partículas y ondas expansivas.
- `high-visuals.ts`: primitivas blancas/doradas de la vista previa.
- `../item-low-level-upgrade/UpgradeEffectView.tsx`: capas y ciclo de vida React compartidos.
- `../item-low-level-upgrade/upgrade-renderer.ts`: reloj, espera y selección de final.
- `../item-low-level-upgrade/failure-ending.ts`: rotura compartida sin cambios.
