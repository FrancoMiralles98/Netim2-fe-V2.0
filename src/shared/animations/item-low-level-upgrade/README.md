# ItemLowLevelUpgradeEffect

Animación de mejora de nivel bajo con **preparación compartida** y finales
independientes. El resultado lo entrega el consumidor; el componente no hace
peticiones ni calcula éxito o rotura.

1. El ítem se eleva, recibe pequeños destellos y su silueta se vuelve blanca.
2. Con `result="pending"` permanece blanco y elevado, sin repetir la preparación.
3. Con `result="success"` emite el destello blanco aprobado y baja a su posición.
4. Con `result="failure"` pasa de blanco a rojo/anaranjado, aparecen cinco cortes
   oscuros sobre su silueta y se rompe en fragmentos que caen, se oscurecen y
   desaparecen. No hay destello de éxito ni descenso del objeto intacto.
5. Con `result="protected-failure"` se vuelve naranja con destello central
   blanco y chispas que saltan en arcos; baja y recupera su color sin romperse.

El final de fallo representa **destrucción**. Usarlo solo cuando el backend
confirme que el ítem se rompió, nunca para un fallo protegido que lo conserva.
El rango numérico de nivel bajo lo define la lógica del herrero.

Para un fallo que conserva el objeto, usá `protected-failure` en lugar de
`failure`. Ver [el final sin rotura](../item-upgrade-protected-failure/README.md).

## Preparar mientras se espera el resultado

```tsx
import { ItemLowLevelUpgradeEffect } from "../../../shared/animations";
import type { ItemLowLevelUpgradeResult } from "../../../shared/animations";

// Estado del intento actual: empieza en "pending" y cambia cuando responde el backend.
const result: ItemLowLevelUpgradeResult = upgradeVisualResult;

<ItemLowLevelUpgradeEffect
    key={upgradeAttemptId}
    src="/items/200.png"
    alt="Arma en la forja"
    result={result}
    onComplete={handleVisualComplete}
/>
```

Cambiá **solo `result`** al recibir la respuesta. Mantené la misma `key` y `src`
durante el intento: cambiar alguno reinicia la secuencia. Si el resultado llega
antes de completar la preparación, se guarda y se reproduce al terminarla. Si
llega después, el ítem espera suspendido y continúa desde allí. No se ejecuta
un bucle ni se mantiene un `requestAnimationFrame` activo durante la espera.

El resultado queda fijado cuando empieza el final. Los cambios posteriores se
ignoran hasta un nuevo intento, para no mezclar rotura con éxito. `onComplete`
se ejecuta una vez al terminar el final; nunca al entrar en la espera.

## Reproducir un resultado ya conocido

```tsx
import {
    ItemLowLevelUpgradeSuccessEffect,
    ItemLowLevelUpgradeFailureEffect,
} from "../../../shared/animations";

// Preparación + final de éxito; conserva la API y duración de la versión anterior.
<ItemLowLevelUpgradeSuccessEffect
    key={successfulUpgradeId}
    src={item.img}
    alt={item.name}
    duration={3550}
    onComplete={handleVisualComplete}
/>

// Preparación + final de fallo con rotura confirmada.
<ItemLowLevelUpgradeFailureEffect
    key={destroyedUpgradeId}
    src={destroyedItemImage}
    alt="Objeto que se rompió al mejorar"
    onComplete={handleVisualComplete}
/>
```

Ambos componentes reutilizan el mismo motor. El de éxito fija `result="success"`
y el de fallo fija `result="failure"`. No hay dos preparaciones distintas.

## Propiedades del componente compartido

| Propiedad | Predeterminado | Comportamiento |
| --- | --- | --- |
| `src: string` | Obligatoria | Imagen transparente del ítem, incluida en el componente. |
| `alt: string` | Obligatoria | Nombre accesible de la imagen. |
| `result` | `"pending"` | `"pending"`, `"success"`, `"failure"` o `"protected-failure"`. |
| `width`, `height` | `64`, `192` | Tamaño del espacio reservado, en píxeles CSS. |
| `preparationDuration` | `2300` | Duración de la preparación en ms; no incluye espera. |
| `endingDuration` | `1250` / `1850` / `4300` | Duración en ms de éxito / rotura / fallo protegido. |
| `liftDistance` | `32` | Elevación en píxeles CSS; admite `0`. |
| `active` | `true` | `false` cancela y restaura el ítem original sin callback. |
| `paused` | `false` | Congela y reanuda toda la secuencia sin perder progreso. |
| `className`, `style` | — | Presentación del contenedor; `style` prevalece sobre tamaño. |
| `onComplete` | — | Callback una vez al terminar el final seleccionado. |
| `onError` | — | Error de carga de la imagen principal; no finaliza con éxito. |

El componente de éxito conserva `duration` (3550 ms por defecto), que reparte
entre preparación y final en la proporción original 2300:1250. No expone
`result`, `preparationDuration` ni `endingDuration`. El de fallo admite las
propiedades del compartido salvo `result`.

Valores numéricos no finitos, tamaños o duraciones no positivos, o elevación
negativa usan el predeterminado. Configuraciones que cambian `src`, `active`,
`preparationDuration`, `endingDuration` o `liftDistance` reinician/cancelan la
ejecución. Cambiar tamaño, callbacks, `result` o `paused` no reinicia la carga.

## Finales separados

| Fase | Tiempo predeterminado |
| --- | --- |
| Preparación común | 2300 ms. Elevación de 180–830 ms; blanqueado de 600–2150 ms. |
| Espera opcional | Hasta recibir resultado, sin consumir tiempo de los finales. |
| Éxito | 1250 ms: flash inicial de 240 ms y descenso de 320–1040 ms. |
| Rotura | 1850 ms: blanco → rojo/anaranjado durante los primeros 555 ms; cortes escalonados desde 518 ms; fragmentación desde 981 ms hasta desaparecer. |
| Fallo protegido | 4300 ms: naranja, destello blanco, chispas en arco y recuperación del color y posición. |

Sin espera: el éxito dura 3550 ms y la rotura 4150 ms. El éxito conserva los
tiempos del efecto aprobado. Sus últimas partículas blancas se apagan durante
el comienzo del final. En rotura se apagan al terminar la preparación.
El fallo protegido suma 6600 ms con la preparación predeterminada.

## Estado final, accesibilidad y limpieza

- Tras éxito se conserva la imagen en su posición inicial. Tras rotura queda
  invisible **también después de redimensionar**; su espacio sigue reservado y
  la imagen se retira del árbol accesible. No desmontes/remontes con el mismo
  ítem roto si no querés que vuelva a aparecer. El consumidor debe aplicar el
  estado de inventario confirmado por el backend.
- `active={false}` restaura explícitamente la imagen, incluso después de una
  rotura; se usa para cancelar/reiniciar, no para mantener visible el resultado
  de destrucción. Para finalizar una rotura, retirá el ítem desde el consumidor.
- Con movimiento reducido no hay elevación, destellos, cortes ni fragmentos.
  Espera el resultado y aplica el estado final: conserva la imagen en éxito o fallo protegido y
  la oculta en rotura. Llama a `onComplete` una vez, sin animación, tras cargar,
  estar activo, sin pausa y con la pestaña visible.
- Al ocultar la pestaña se congela el reloj; al volver continúa. Pausa y espera
  no cuentan como duración. No se inicia el efecto antes de cargar la imagen.
- Si la imagen falla se llama a `onError`, sin `onComplete`. El consumidor debe
  resolver ese estado. Desactivar o desmontar tampoco llama a `onComplete`.
- Las máscaras respetan el alfa de la imagen; usar PNG/WebP transparente. Los
  fragmentos son 40 recortes triangulares irregulares de esa silueta, no cuadrados con fondo. No se leen
  píxeles para éxito o rotura. El final protegido muestrea alfa en un canvas
  aislado y tiene alternativa sin acceso a píxeles. Para URLs externas, verificar también
  que permitan su uso como máscara CSS; se recomiendan recursos del frontend.
- `overflow` debe quedar visible en los ancestros para no cortar elevación ni
  fragmentos. El efecto no intercepta clics ni mueve el layout del resto de UI.
- Canvas transparente, DPR hasta 2 y redimensionado con `ResizeObserver`.
  Sin canvas 2D, la silueta, cortes y fragmentos DOM siguen funcionando; se
  omiten las partículas y el flash dibujados en canvas.
- El desmontaje cancela el reloj y retira todos los listeners y observadores.
  No se agregan dependencias ni se cambia el asset original.

## Archivos

- `ItemLowLevelUpgradeEffect.tsx`: componente y API compartida.
- `UpgradeEffectView.tsx`: vista interna reutilizada por los niveles bajo, moderado, alto y el acceso directo al final protegido.
- `upgrade-renderer.ts`: preparación, espera, elección del final y ciclo de vida.
- `upgrade-visuals.ts`: partículas y resplandor de la carga original.
- `success-ending.ts`: flash blanco y descenso del final exitoso.
- `failure-ending.ts`: transición cálida, cortes y fragmentos de la rotura.
- `item-low-level-upgrade.css`: capas, máscaras y movimiento reducido.

La animación solo presenta un resultado: no cambia las probabilidades, no
consume materiales ni yang, y no decide si existe protección contra rotura.

La variante [ItemModerateUpgradeEffect](../item-moderate-upgrade/README.md)
comparte este motor y la rotura, pero añade carga blanca/dorada con un núcleo
y aro vibrante y un final exitoso dorado distinto. El efecto de nivel bajo
conserva su comportamiento original.

La variante [ItemHighUpgradeEffect](../item-high-upgrade/README.md) también
reutiliza el motor y la rotura: añade vibración creciente del ítem, remolino,
partículas entrantes aceleradas y explosión de luces y ondas al tener éxito.
