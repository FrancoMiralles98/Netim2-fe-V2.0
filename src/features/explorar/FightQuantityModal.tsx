import { useEffect, useId, useRef, useState } from "react";

interface FightQuantityModalProps {
    mobName: string;
    maxQuantity: number;
    onConfirm: (quantity: number) => void;
    onClose: () => void;
}

export const FightQuantityModal = ({ mobName, maxQuantity, onConfirm, onClose }: FightQuantityModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const titleId = useId();
    const quantityId = useId();
    const [quantity, setQuantity] = useState("1");
    const parsedQuantity = Number(quantity);
    const isValid = Number.isSafeInteger(parsedQuantity) && parsedQuantity >= 1 && parsedQuantity <= maxQuantity;

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog?.showModal();
        inputRef.current?.focus();
        inputRef.current?.select();
        return () => dialog?.close();
    }, []);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }}
            className="fixed inset-0 m-auto w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-[#b18853] bg-[#17120d] p-5 text-amber-100 shadow-2xl backdrop:bg-black/60"
        >
            <h3 id={titleId} className="font-metin text-xl font-semibold">Preparar combate</h3>
            <p className="mt-2 text-sm text-stone-300">{mobName}</p>
            <form onSubmit={(event) => {
                event.preventDefault();
                if (isValid) onConfirm(parsedQuantity);
            }}>
                <label htmlFor={quantityId} className="mt-4 block text-sm">
                    Cantidad de enemigos (1 – {maxQuantity})
                </label>
                <input
                    ref={inputRef}
                    id={quantityId}
                    type="number"
                    min={1}
                    max={maxQuantity}
                    step={1}
                    required
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="mt-2 w-full rounded border border-[#80603a] bg-black/60 px-3 py-2 text-white outline-none focus:border-amber-200"
                />
                <div className="mt-5 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="cursor-pointer px-3 py-2 text-stone-300 hover:text-white">
                        Cancelar
                    </button>
                    <button type="submit" disabled={!isValid} className="cursor-pointer rounded border border-[#b18853] bg-[#56351d] px-4 py-2 font-semibold hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40">
                        Aceptar
                    </button>
                </div>
            </form>
        </dialog>
    );
};
