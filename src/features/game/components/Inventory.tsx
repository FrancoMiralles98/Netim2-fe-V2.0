import type { CharacterSession } from "netim2-shared";

const INVENTORY_COLUMNS = 16;
const INVENTORY_ROWS = 6;
const INVENTORY_SLOTS = Array.from(
    { length: INVENTORY_COLUMNS * INVENTORY_ROWS },
    (_, index) => index,
);

export const Inventory = ({ character }: { character: CharacterSession }) => (
    <div className="h-full w-full bg-[url('/game/marco-inventario-horizontal.png')] bg-[length:100%_100%] bg-no-repeat font-sans">
        <div className="flex h-[17%] w-full items-center px-[3%]">
            <h2 className="text-[17px] mt-3 font-semibold text-[#e9cf99] [text-shadow:0_1px_2px_#000]">
                Inventario
            </h2>
        </div>
        <div className="ml-[3%] mt-2 flex h-[192px] w-[94%] min-w-0">
            <div
                className="grid h-[192px] w-[512px] shrink-0"
                style={{
                    gridTemplateColumns: `repeat(${INVENTORY_COLUMNS}, 32px)`,
                    gridTemplateRows: `repeat(${INVENTORY_ROWS}, 32px)`,
                }}
            >
                {INVENTORY_SLOTS.map((slot) => (
                    <div
                        key={slot}
                        className="h-[32px] w-[32px] bg-[url('/game/inventory/bg_item.png')] bg-no-repeat"
                    />
                ))}
            </div>
            <hr aria-hidden="true" className="mx-5 h-full w-px shrink-0 border-0 bg-[#a97735]/75" />
            <div className="flex min-w-0 flex-1 flex-col text-[#e9cf99]">
                <section className="flex h-[58%] flex-col border-b border-[#a97735]/75">
                    <h3 className="text-center text-[16px] font-semibold">Buffos</h3>
                    {character.buffos?.length ? (
                        <div className="flex min-h-0 flex-1 flex-wrap content-start justify-center gap-2 overflow-y-auto px-2 py-1">
                            {character.buffos.map((buff) => (
                                <img
                                    key={buff.id_buff}
                                    src={buff.buff_icon}
                                    alt={buff.buff_name}
                                    title={buff.buff_description || buff.buff_name}
                                    className="h-[32px] w-[32px] object-contain"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="flex min-h-0 flex-1 items-center justify-center text-[12px] text-[#c7ced8]">
                            No tiene buffos activados
                        </p>
                    )}
                </section>
                <section className="flex min-h-0 flex-1 items-center justify-center gap-3">
                    <h3 className="text-[16px] font-semibold">Montura:</h3>
                    {character.montura ? (
                        <div className="flex min-w-0 items-center gap-2">
                            <img src={character.montura.img} alt="" className="h-[32px] w-[32px] shrink-0 object-contain" />
                            <span className="truncate text-[12px] text-[#c7ced8]">{character.montura.montura.name}</span>
                        </div>
                    ) : (
                        <span className="text-[12px] text-[#c7ced8]">No tienes montura equipada</span>
                    )}
                </section>
            </div>
        </div>
    </div>
);
