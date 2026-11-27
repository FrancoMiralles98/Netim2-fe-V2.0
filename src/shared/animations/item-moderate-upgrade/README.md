# ItemModerateUpgradeEffect

Animación de **mejoras moderadas**: conserva la elevación y atracción de destellos
del nivel bajo, con una silueta blanca de tonalidad dorada. En el centro aparece
una chispa rodeada de un aro blanco/dorado que vibra y aumenta gradualmente de
tamaño hasta completar la preparación.

- `pending`: el ítem queda elevado, blanco/dorado, con el núcleo y aro a su
  tamaño máximo. La vibración continúa; el crecimiento tiene un límite.
- `success`: un destello dorado más grande sustituye al núcleo. Catorce mini
  destellos salen desde el centro, se alejan un poco, quedan brillando cerca
  del ítem y se apagan mientras este baja a su posición original.
- `failure`: reutiliza **sin cambios** el final de rotura del nivel bajo:
  transición rojo/anaranjado, cortes oscuros y fragmentación hasta desaparecer.
  Se retiran el aro y el núcleo dorados al comenzar ese final.

El rango numérico de mejora moderada y el resultado los determina el consumidor.
`failure` representa **rotura confirmada**, no un fallo protegido que conserva
el objeto. El componente no hace peticiones ni aplica mejoras.

También admite `result="protected-failure"` para fallo **sin rotura**: final
naranja con destello central blanco, chispas en arco y recuperación del ítem.
Este final dura 4300 ms por defecto; con la carga moderada suma 6600 ms sin
espera. Ver [uso y detalles](../item-upgrade-protected-failure/README.md).

## Uso mientras se espera la respuesta

```tsx
import { ItemModerateUpgradeEffect } from "../../../shared/animations";
import type { ItemModerateUpgradeResult } from "../../../shared/animations";

// Empieza en "pending" y cambia al recibir la respuesta del backend.
const visualResult: ItemModerateUpgradeResult = upgradeResult;

<ItemModerateUpgradeEffect
    key={upgradeAttemptId}
    src="/items/200.png"
    alt="Arma en la forja"
    result={visualResult}
    onComplete={handleVisualComplete}
/>
```

Mantené la misma `key` y `src` mientras llega el resultado. Cambiá solo `result`
para continuar sin repetir la preparación. Si llega antes, se reproduce el
final después de cargar; si llega tarde, continúa desde la espera.

Para un resultado ya conocido, usá `result="success"`, `result="failure"` o `result="protected-failure"`
desde el inicio. La secuencia completa incluye la preparación. El resultado
queda fijado al comenzar el final y `onComplete` se ejecuta solo una vez.

## Propiedades

Comparte las propiedades de `ItemLowLevelUpgradeEffect` y el mismo ciclo de
vida. Se exportan `ItemModerateUpgradeEffect`, `ItemModerateUpgradeEffectProps`
y `ItemModerateUpgradeResult` desde `shared/animations`.

| Propiedad | Predeterminado | Función |
| --- | --- | --- |
| `src`, `alt` | Obligatorias | Imagen transparente y su descripción accesible. |
| `result` | `"pending"` | Espera, éxito, `failure` con rotura o `protected-failure` sin rotura. |
| `width`, `height` | `64`, `192` | Espacio del ítem en píxeles CSS. |
| `preparationDuration` | `2300` | Duración de carga, elevación y crecimiento del núcleo, en ms. |
| `endingDuration` | `2100` en éxito / `1850` en rotura / `4300` en fallo protegido | Duración del final elegido, en ms. |
| `liftDistance` | `32` | Elevación en píxeles CSS. |
| `active` | `true` | `false` cancela y restaura el ítem sin callback. |
| `paused` | `false` | Congela también la vibración y los mini destellos. |
| `className`, `style` | — | Presentación del contenedor. |
| `onComplete`, `onError` | — | Finalización visual y error de carga de la imagen. |

Sin espera, el éxito dura **4400 ms** y el fallo **4150 ms**. Las duraciones
personalizadas escalan cada fase; la espera no consume tiempo de los finales.

## Tiempos del final exitoso

| Tiempo desde el resultado visual | Acción |
| --- | --- |
| 0–525 ms | Destello principal dorado, más grande que el del nivel bajo. |
| 95–641 ms | Los mini destellos nacen en el centro y viajan hacia afuera. |
| Hasta 1407 ms | Quedan próximos al ítem, brillando con titileo suave. |
| 672–1974 ms | El ítem baja suavemente a la posición original. |
| 1407–2100 ms | Los mini destellos se apagan hasta desaparecer. |

Las luces se anclan a la posición donde terminó la carga; no bajan pegadas al
ítem. El aro llega a un radio aproximado de 27 px para un ítem de referencia
de 64×192 px; la vibración es de aproximadamente 1 px. Los destellos externos
se alejan entre 42 y 76 px a esa escala. Todo escala con el tamaño visible.

## Comportamiento compartido

- El motor y la vista son compartidos con el nivel bajo; ese efecto conserva
  su carga blanca y su final original. `failure-ending.ts` no se modifica.
- El ítem permanece oculto tras la rotura, incluso al redimensionar. El éxito
  restaura su posición e imagen. `active={false}` cancela y restaura cualquiera.
- Respeta pausa y pestaña oculta. Al desmontar se cancelan los fotogramas y
  se retiran listeners y observadores. La espera moderada mantiene fotogramas
  para vibrar; se suspenden al pausar, ocultar la pestaña o terminar.
- Con movimiento reducido se omiten aro, vibración, elevación, destellos y
  fragmentación. Espera el resultado y aplica el estado final sin animación:
  conserva el ítem en éxito o fallo protegido, y lo oculta en rotura.
  No mantiene un bucle de vibración con esa preferencia.
- Espera la carga de la imagen. Si falla, llama a `onError` y no a `onComplete`.
- Mantiene transparencia y no intercepta clics. Dejá desbordamiento visible
  en los ancestros para no recortar las luces y el movimiento.
- Sin canvas 2D conserva el ítem, color, movimiento y rotura DOM; se omiten
  el aro, núcleo y destellos dibujados en canvas.

Ver [contrato del motor compartido](../item-low-level-upgrade/README.md) para
cancelación, accesibilidad, máscaras, tamaños y estados finales.

## Archivos

- `ItemModerateUpgradeEffect.tsx`: componente y tipos públicos.
- `moderate-charge.ts`: chispa, aro, crecimiento y vibración.
- `moderate-success-ending.ts`: flash dorado y mini destellos exteriores.
- `../item-low-level-upgrade/UpgradeEffectView.tsx`: capas y ciclo de vida React.
- `../item-low-level-upgrade/upgrade-renderer.ts`: reloj, espera y selección de final.
- `../item-low-level-upgrade/failure-ending.ts`: rotura compartida sin cambios.
