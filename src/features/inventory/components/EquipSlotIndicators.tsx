interface EquipSlotIndicatorsProps {
    slots: number;
    filledSlots: number;
}

export const EquipSlotIndicators = ({ slots, filledSlots }: EquipSlotIndicatorsProps) => {
    if (slots <= 0) return null;

    return (
        <div className="pointer-events-none absolute top-[2px] left-[2px] z-3 flex flex-col gap-[2px]" aria-hidden="true">
            {Array.from({ length: slots }, (_, index) => (
                <span
                    key={index}
                    className={`h-[6px] w-[6px] rounded-full border border-white ${index < filledSlots ? "bg-green-500" : "bg-black"}`}
                />
            ))}
        </div>
    );
};
