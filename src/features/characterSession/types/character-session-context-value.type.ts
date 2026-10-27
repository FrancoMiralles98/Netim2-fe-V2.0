import type { ApplyBuffResponse, BuyEquipmentSlotResponse, CharacterSession, CharacterSummary, DiscardInventoryItemResponse, EquipItemResponse, GameConfigResponse, IncreaseCharacterAttributeResponse, MergeInventoryItemsResponse, MoveInventoryItemResponse, OpenChestResponse, SelectEquipmentResponse, SplitInventoryItemResponse, UnequipItemResponse, UsePotionResponse, UseReservePotionResponse } from "netim2-shared";
import type { SessionEndReason } from "./session-end-reason.type";


export interface CharacterSessionContextValue {
    character: CharacterSession | null
    gameConfig: GameConfigResponse | null
    isReady: boolean;
    sessionEndReason: SessionEndReason
    isConnected: boolean;
    worldSessionId: string | null
    enterGame: (character: CharacterSummary) => Promise<void>
    updateInventoryItemPosition: (characterId: string, movedItem: MoveInventoryItemResponse) => void
    applyEquipmentResponse: (characterId: string, response: EquipItemResponse) => void
    applyUnequipmentResponse: (characterId: string, response: UnequipItemResponse) => void
    applyEquipmentSlotPurchaseResponse: (characterId: string, response: BuyEquipmentSlotResponse) => void
    applyEquipmentSelectionResponse: (characterId: string, response: SelectEquipmentResponse) => void
    applyAttributeIncreaseResponse: (characterId: string, response: IncreaseCharacterAttributeResponse) => void
    applyPotionUseResponse: (characterId: string, response: UsePotionResponse | UseReservePotionResponse) => void
    applyBuffResponse: (characterId: string, response: ApplyBuffResponse) => void
    applyChestResponse: (characterId: string, response: OpenChestResponse) => void
    runCharacterMutation: <T>(characterId: string, action: () => Promise<T>) => Promise<T>
    applySplitInventoryItemResponse: (characterId: string, response: SplitInventoryItemResponse) => void
    applyMergeInventoryItemsResponse: (characterId: string, response: MergeInventoryItemsResponse) => void
    applyDiscardInventoryItemResponse: (characterId: string, response: DiscardInventoryItemResponse) => void
    leaveGame: () => void
    leaveGameToCharacterSelection: () => void

}
