import type { CharacterSession } from "netim2-shared";
import { Inventory } from "../inventory/Inventory";
import "./herrero.css";
import { useForgePreview } from "./hooks/useForgePreview";
import { ForgePreview } from "./components/ForgePreview";
import { ForgeModifiers } from "./components/ForgeModifiers";
import { useCharacterSession } from "../characterSession/hooks/useCharacterSession";

interface HerreroProps {
    character: CharacterSession;
}

export const Herrero = ({ character }: HerreroProps) => {
    const { gameConfig } = useCharacterSession();
    const { selection, isPending, placeInForge, clear } = useForgePreview(character.id);
    const selectedItem = selection ? character.inventario.find(item => item.id === selection.itemId && item.type === "equip") : undefined;
    const forgedItem = selectedItem?.type === "equip" ? selectedItem : undefined;

    return (
    <section
        aria-label="Herrero"
        className="relative aspect-[4/3] w-[1100px] justify-self-center bg-[length:100%_100%] bg-no-repeat"
        style={{ backgroundImage: character.reino ? `url('/game/modal-${character.reino}-rectangular.png')` : undefined }}
    >
        <div className="absolute inset-[5%] grid place-items-center">
            <div className="relative w-full">
                <img
                    src="/herrero/herrero.png"
                    alt="Taller del herrero con su yunque"
                    className="block h-auto w-full"
                />
                <div
                    aria-hidden="true"
                    className="herrero-anvil-glow"
                />
                <img
                    src="/herrero/panel-herrero.png"
                    alt="Panel del herrero"
                    className="absolute top-[9.5%] right-[2%] aspect-square w-[33%] object-contain"
                />
                {forgedItem && selection && <ForgePreview item={forgedItem} preview={selection.preview} character={character} onRemove={clear} />}
                <ForgeModifiers
                    modifiers={gameConfig?.herrero.modifiers ?? []}
                    character={character}
                    item={forgedItem}
                    selectedModifierId={selection?.preview.modifier?.itemId}
                    isPending={isPending}
                    onSelect={modifierItemId => { if (forgedItem) void placeInForge(forgedItem, modifierItemId); }}
                />
                <div
                    role="region"
                    aria-label="Inventario del personaje"
                    className="absolute top-[63%] right-[3%] bottom-[3%] left-[3%] flex items-center justify-center font-sans"
                >
                    <Inventory items={character.inventario} character={character} onForge={placeInForge} hiddenItemIds={forgedItem ? [forgedItem.id] : []} isShopPending={isPending} />
                </div>
            </div>
        </div>
    </section>
    );
};
