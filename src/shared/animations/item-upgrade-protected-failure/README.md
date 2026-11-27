# ItemUpgradeProtectedFailureEffect

Final de **fallo de mejora sin rotura**, basado en la última vista previa aprobada:

1. Parte del ítem blanco y elevado.
2. El ítem se vuelve anaranjado mientras un destello central **blanco** crece.
3. Salen **64 chispas naranjas de cuatro puntas** desde distintos puntos del ítem,
   hacia todos los lados. Describen arcos, caen y se apagan durante la caída.
4. El ítem baja y recupera gradualmente su color original. **Permanece intacto**.

No muestra cortes, fragmentos ni explosión de éxito. Es un final compartido
para mejoras bajas, moderadas y altas. El resultado y la conservación del
objeto deben estar confirmados por el backend; el efecto no decide protección.

## Reproducir solo el final

```tsx
import { ItemUpgradeProtectedFailureEffect } from "../../../shared/animations";

<ItemUpgradeProtectedFailureEffect
    key={upgradeAttemptId}
    src="/items/200.png"
    alt="Arma conservada tras fallar la mejora"
    onComplete={handleVisualComplete}
    onError={handleImageError}
/>
```

Este componente **incluye la imagen** y omite la preparación. Empieza con el
ítem blanco y elevado, como el GIF aprobado. Reemplazá la imagen del slot por
el componente; no lo superpongas sobre otra copia. No incluye fondo ni pedestal.

Usá este acceso directo cuando ya tenés confirmado el fallo sin rotura y querés
presentar únicamente su final. Si la carga ya se está reproduciendo con alguno
de los componentes de nivel, preferí cambiar su `result` en la misma instancia.

## Continuar desde la preparación de cualquier nivel

```tsx
import { ItemHighUpgradeEffect } from "../../../shared/animations";
import type { ItemHighUpgradeResult } from "../../../shared/animations";

// Estado inicial: "pending". Cambiar tras recibir el resultado del servidor.
const visualResult: ItemHighUpgradeResult = upgradeVisualResult;

<ItemHighUpgradeEffect
    key={upgradeAttemptId}
    src={item.img}
    alt={item.name}
    result={visualResult}
    onComplete={handleVisualComplete}
/>

// Cuando el servidor confirma fallo SIN destrucción:
// setUpgradeVisualResult("protected-failure");
```

El mismo `result="protected-failure"` funciona en `ItemLowLevelUpgradeEffect`
y `ItemModerateUpgradeEffect`. Mantené `key` y `src` durante el intento: cambiar
solo `result` continúa desde la carga actual, sin repetirla. Si llega temprano,
el motor espera a terminar la preparación. Si llega tarde, continúa desde la
espera. Detiene el aro, remolino y vibración de la carga antes de este final.

Los cuatro valores de resultado son:

| `result` | Significado |
| --- | --- |
| `pending` | Todavía espera una respuesta. |
| `success` | Mejora exitosa; final específico de cada nivel. |
| `failure` | Fallo **con rotura**; conserva el comportamiento anterior. |
| `protected-failure` | Fallo **sin rotura**; nuevo final naranja con destello blanco y chispas en arco. |

No cambies los usos existentes de `failure` para representar un fallo protegido.
El resultado se fija cuando empieza el final; cambios posteriores se ignoran
hasta una nueva ejecución. `onComplete` confirma la finalización visual, no
aplica mejoras ni actualiza por sí solo el inventario.

## Propiedades del componente de final

| Propiedad | Predeterminado | Función |
| --- | --- | --- |
| `src: string` | Obligatoria | Imagen original del ítem; preferentemente transparente. |
| `alt: string` | Obligatoria | Texto alternativo de la imagen principal. |
| `width`, `height` | `64`, `192` | Espacio reservado en píxeles CSS. |
| `endingDuration` | `4300` | Duración del final en milisegundos. |
| `liftDistance` | `32` | Elevación inicial en píxeles CSS; admite `0`. |
| `active` | `true` | `false` cancela y muestra la imagen original en reposo. |
| `paused` | `false` | Congela color, posición, destello y chispas. |
| `className`, `style` | — | Presentación del contenedor. |
| `onComplete` | — | Una llamada al terminar el final. |
| `onError` | — | Error de carga de la imagen; no llama a `onComplete`. |

El acceso directo no recibe `result`, `tier` ni `preparationDuration`: siempre
reproduce solo el final protegido. Cambiar la `key` permite repetirlo. Cambiar
`src`, elevación o duración lo reinicia; callbacks, tamaño y pausa no lo hacen.
Los valores no finitos o no positivos de tamaño/duración usan el predeterminado;
la elevación debe ser finita y no negativa.

En los componentes de nivel, `endingDuration` también controla este final.
Si lo omitís, todos usan 4300 ms para `protected-failure`, conservando sus
duraciones anteriores para éxito y rotura.

## Tiempos de la vista aprobada

| Tiempo desde el comienzo del final | Acción |
| --- | --- |
| 0–300 ms | Ítem blanco, elevado y en reposo. |
| 300–1100 ms | Transición a naranja. |
| 300–1400 ms | Destello central blanco creciente, que luego se apaga. |
| 1120–1810 ms | Emisión escalonada de chispas desde toda la silueta. |
| Hasta unos 3220 ms | Las chispas siguen arcos y se apagan al caer. |
| 1600–3100 ms | Descenso hacia la posición original. |
| 1800–3450 ms | Recuperación gradual del color original. |
| 4300 ms | Limpieza y `onComplete`; el ítem queda visible e intacto. |

Las duraciones personalizadas escalan toda esta secuencia. Sin tiempo de espera,
preparación más final protegido dura 6600 ms en niveles bajo/moderado y 7900 ms
en alto. El componente de solo final dura 4300 ms.

## Imagen, chispas y ciclo de vida

- Las chispas usan la misma forma de cuatro puntas de la vista previa, con
  color naranja y una estela corta que sigue su trayectoria parabólica. Sus
  orígenes se congelan al emitirlas; no bajan pegadas al ítem.
- El motor toma una muestra de alfa una sola vez al seleccionar este final,
  en un canvas aislado de hasta 96×96 px. Esto distribuye las chispas sobre el
  objeto visible, respetando imágenes con distinta relación de aspecto.
- Si no hay acceso a píxeles (por ejemplo una URL externa sin CORS), canvas 2D
  no está disponible o la imagen es totalmente transparente, usa posiciones
  deterministas en una franja central. No tainta los canvas visibles ni
  cancela la animación. Se recomiendan los assets del frontend.
- La muestra no cambia el archivo original. El color del ítem usa una máscara
  CSS con el alfa; la recuperación solo retira esa capa para mostrar la imagen.
- Fondo transparente y sin interacción de puntero. Dejá `overflow` visible en
  los ancestros y espacio alrededor para no recortar los arcos ni el descenso.
- Pausa y pestaña oculta congelan el reloj. Movimiento reducido omite todos
  los efectos y conserva la imagen intacta; completa una vez cuando está
  cargada, activa, sin pausa y con la pestaña visible.
- Si falta canvas 2D, conserva transición naranja, recuperación y descenso;
  se omiten el destello y las chispas. El callback sigue funcionando.
- Cancelar o desmontar no llama a `onComplete`. El desmontaje cancela
  fotogramas y retira listeners/observadores. No agrega dependencias.
- Al terminar se mantiene el tamaño del slot, la imagen visible y su `alt`,
  incluso después de redimensionar. No se oculta el ítem como en una rotura.

## Archivos

- `ItemUpgradeProtectedFailureEffect.tsx`: componente público de solo final.
- `protected-failure-ending.ts`: color, destello blanco y chispas en arco.
- `protected-failure-particles.ts`: muestreo de silueta y partículas deterministas.
- `../item-low-level-upgrade/UpgradeEffectView.tsx`: capas React compartidas.
- `../item-low-level-upgrade/upgrade-renderer.ts`: selección del final y reloj compartido.
