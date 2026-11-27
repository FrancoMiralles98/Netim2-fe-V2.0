import { useId } from "react";
import "./venta-rapida.css";

export const VentaRapida = ({ activada, onChange }: { activada: boolean; onChange: (activada: boolean) => void }) => {
    const mensajeId = useId();

    return (
        <div className="absolute top-[60%] right-[3%] left-[23%] grid h-[5%] grid-cols-[29fr_45fr] items-center text-[#ead9b5] [text-shadow:0_1px_2px_#000]">
            <button
                type="button"
                role="switch"
                aria-checked={activada}
                aria-label="Venta rápida"
                aria-describedby={mensajeId}
                onClick={() => onChange(!activada)}
                className="venta-rapida-control justify-self-center"
            >
                <span className="venta-rapida-label">Venta rápida</span>
                <span aria-hidden="true" className="venta-rapida-switch">
                    <span className="venta-rapida-thumb" />
                </span>
                <span className="venta-rapida-status">{activada ? "Activada" : "Desactivada"}</span>
            </button>
            <p id={mensajeId} aria-live="polite" className="flex-1 text-center text-[11px]">
                {activada
                    ? 'Al seleccionar "Vender" se realizara la accion automaticamente'
                    : ""}
            </p>
        </div>
    );
};
