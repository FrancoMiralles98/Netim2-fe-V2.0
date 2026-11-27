# ItemLowLevelUpgradeFailureEffect

Reproduce la preparación común y el final de **fallo con rotura** de nivel bajo.
El ítem blanco se torna rojo/anaranjado, recibe cortes oscuros y se fragmenta
hasta desaparecer. No reproduce el destello ni el descenso del éxito.

Usar solo tras confirmar destrucción con el backend. Un fallo protegido que
conserva el ítem no corresponde a este efecto. El ítem permanece oculto al
final; `active={false}` lo restaura porque cancela la animación.

```tsx
import { ItemLowLevelUpgradeFailureEffect } from "../../../shared/animations";

<ItemLowLevelUpgradeFailureEffect
    key={destroyedUpgradeId}
    src="/items/200.png"
    alt="Arma rota al mejorar"
    onComplete={handleVisualComplete}
/>
```

Por defecto: preparación de 2300 ms y final de 1850 ms (4150 ms en total).
Acepta la API compartida salvo `result`, que fija en `"failure"`.

Para preparar mientras esperás la respuesta y elegir el final sin reiniciar,
usá `ItemLowLevelUpgradeEffect` con `result="pending"` y después cambialo a
`"failure"` o `"success"`.

Ver [API, tiempos y ciclo de vida](../item-low-level-upgrade/README.md).
