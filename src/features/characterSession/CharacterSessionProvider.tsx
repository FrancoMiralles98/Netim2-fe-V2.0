import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CharacterSessionContext } from "./context/character-session.context";
import { useGameSocket } from "../../api/hooks/use-game-socket";
import { useNavigate } from "react-router";
import { RouterPaths } from "../../app/router/router-paths.types";
import { useModal } from "../../shared/modal/hooks/useModal";
import type { ApplyBuffResponse, BuyEquipmentSlotResponse, CharacterSession, CharacterSummary, DiscardInventoryItemResponse, EquipItemResponse, GameConfigResponse, IncreaseCharacterAttributeResponse, MergeInventoryItemsResponse, MoveInventoryItemResponse, OpenChestResponse, RefreshBuffsResponse, SelectEquipmentResponse, SplitInventoryItemResponse, UnequipItemResponse, UsePotionResponse, UseReservePotionResponse } from "netim2-shared";
import { applyEquipmentToCharacter, applyUnequipmentToCharacter } from "./utils/apply-equipment-response";
import { applyPotionUseResponseToCharacter } from "./utils/apply-potion-use-response";
import { applySplitInventoryResponseToCharacter } from "./utils/apply-split-inventory-response";
import { applyMergeInventoryResponseToCharacter } from "./utils/apply-merge-inventory-response";
import { applyBuffResponseToCharacter } from "./utils/apply-buff-response";
import { getCharacterSessionRequest, getGameConfigRequest } from "./api/character-session.services";
import type { SessionEndReason } from "./types/session-end-reason.type";
import { refreshBuffsRequest } from "../inventory/api/buff.services";
import { applyChestResponseToCharacter } from "./utils/apply-chest-response";

export const CharacterSessionProvider = ({ children }: { children: ReactNode }) => {

    const [character, setCharacter] = useState<CharacterSession | null>(null)
    const [gameConfig, setGameConfig] = useState<GameConfigResponse | null>(null)
    const navigate = useNavigate()
    const [sessionEndReason, setSessionEndReason] = useState<SessionEndReason>(null);
    const loading = useRef(false)
    const modal = useModal()
    const mutationQueue = useRef<Promise<void>>(Promise.resolve());
    const refreshInFlight = useRef(false);

    // Incluye la aplicación de la respuesta para que ninguna mutación local la adelante.
    const runCharacterMutation = useCallback(<T,>(_characterId: string, action: () => Promise<T>): Promise<T> => {
        const result = mutationQueue.current.then(action);
        mutationQueue.current = result.then(() => undefined, () => undefined);
        return result;
    }, []);

    const characterId = character?.id;
    const buffos = character?.buffos;
    useEffect(() => {
        if (!characterId || !buffos?.length) return;

        let timer: ReturnType<typeof setTimeout> | undefined;
        let cancelled = false;
        const expiresAt = (buff: typeof buffos[number]) =>
            buff.buff_inicialization + buff.buff_duration * 1000;

        const schedule = (retryDelay?: number) => {
            if (timer) clearTimeout(timer);
            if (cancelled) return;
            const nextExpiry = Math.min(...buffos.map(expiresAt));
            const delay = retryDelay ?? Math.max(0, nextExpiry - Date.now());
            timer = setTimeout(() => { void checkExpired(); }, Math.min(delay, 2_147_483_647));
        };

        const checkExpired = async () => {
            if (cancelled) return;
            if (!buffos.some(buff => expiresAt(buff) <= Date.now())) {
                schedule();
                return;
            }
            if (refreshInFlight.current) {
                schedule(250);
                return;
            }
            refreshInFlight.current = true;
            try {
                await runCharacterMutation(characterId, async () => {
                    if (cancelled) return;
                    const response: RefreshBuffsResponse = await refreshBuffsRequest(characterId);
                    if (cancelled) return;
                    setCharacter(current => current?.id === characterId
                        ? { ...current, stats: response.stats, atributos: response.attributes, buffos: response.buffos }
                        : current);
                });
                // Si el reloj del cliente está adelantado, evitamos un ciclo de peticiones inmediatas.
                schedule(1000);
            } catch {
                schedule(5000);
            } finally {
                refreshInFlight.current = false;
            }
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                if (timer) clearTimeout(timer);
                void checkExpired();
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        schedule();
        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [characterId, buffos, runCharacterMutation]);

    const updateInventoryItemPosition = useCallback((characterId: string, movedItem: MoveInventoryItemResponse) => {
        setCharacter((current) => {
            // Una respuesta pendiente no debe actualizar otro personaje ni reabrir una sesión cerrada.
            if (!current || current.id !== characterId) return current;

            return {
                ...current,
                inventario: current.inventario.map((item) => item.id === movedItem.id
                    ? { ...item, position: { ...movedItem.position } }
                    : item),
            };
        });
    }, []);

    const applyEquipmentResponse = useCallback((characterId: string, response: EquipItemResponse) => {
        setCharacter((current) => current?.id === characterId
            ? applyEquipmentToCharacter(current, response)
            : current);
    }, []);

    const applyUnequipmentResponse = useCallback((characterId: string, response: UnequipItemResponse) => {
        setCharacter((current) => current?.id === characterId
            ? applyUnequipmentToCharacter(current, response)
            : current);
    }, []);

    const applyEquipmentSlotPurchaseResponse = useCallback((characterId: string, response: BuyEquipmentSlotResponse) => {
        setCharacter((current) => current?.id === characterId
            ? {
                ...current,
                equipo_options: { ...response.equipo_options },
                ...(response.currency === 'yang' ? { yang: response.yang } : {}),
            }
            : current);
    }, []);

    const applyEquipmentSelectionResponse = useCallback((characterId: string, response: SelectEquipmentResponse) => {
        setCharacter((current) => current?.id === characterId
            ? {
                ...current,
                equipo_selected: response.equipo_selected,
                stats: response.stats,
                atributos: response.attributes,
                type_weapon: response.type_weapon,
            }
            : current);
    }, []);

    const applyAttributeIncreaseResponse = useCallback((characterId: string, response: IncreaseCharacterAttributeResponse) => {
        setCharacter((current) => current?.id === characterId
            ? {
                ...current,
                stats: response.stats,
                atributos: response.attributes,
                puntos_atributos: response.puntos_atributos,
            }
            : current);
    }, []);

    const applyPotionUseResponse = useCallback((characterId: string, response: UsePotionResponse | UseReservePotionResponse) => {
        setCharacter((current) => current?.id === characterId
            ? applyPotionUseResponseToCharacter(current, response)
            : current);
    }, []);

    const applyBuffResponse = useCallback((characterId: string, response: ApplyBuffResponse) => {
        setCharacter((current) => current?.id === characterId
            ? applyBuffResponseToCharacter(current, response)
            : current);
    }, []);

    const applyChestResponse = useCallback((characterId: string, response: OpenChestResponse) => {
        setCharacter(current => current?.id === characterId
            ? applyChestResponseToCharacter(current, response)
            : current);
    }, []);

    const applySplitInventoryItemResponse = useCallback((characterId: string, response: SplitInventoryItemResponse) => {
        setCharacter((current) => current?.id === characterId
            ? applySplitInventoryResponseToCharacter(current, response)
            : current);
    }, []);

    const applyMergeInventoryItemsResponse = useCallback((characterId: string, response: MergeInventoryItemsResponse) => {
        setCharacter((current) => current?.id === characterId
            ? applyMergeInventoryResponseToCharacter(current, response)
            : current);
    }, []);

    const applyDiscardInventoryItemResponse = useCallback((characterId: string, response: DiscardInventoryItemResponse) => {
        setCharacter((current) => current?.id === characterId
            ? { ...current, inventario: current.inventario.filter((item) => item.id !== response.id) }
            : current);
    }, []);

    const enterGame = async (characterSummary: CharacterSummary) => {
        if (loading.current) return
        try {
            setSessionEndReason(null);
            setGameConfig(null);
            loading.current = true
            modal.showLoadingModal('Cargando mundo...')
            const [data, config] = await Promise.all([
                getCharacterSessionRequest(characterSummary.id),
                getGameConfigRequest(characterSummary.raza, characterSummary.especialidad),
            ])
            setGameConfig(config)
            setCharacter(data)
            modal.closeLoadingModal()
        } catch (error) {
            modal.closeLoadingModal()
            modal.showErrorModal(error)
        } finally {
            loading.current = false
        }
    }

    const handleSessionReplaced = () => {
        setSessionEndReason('replaced');
        modal.closeLoadingModal();

        modal.showNotificationModal({
            title: 'Sesión reemplazada, Tu cuenta se conectó con otro personaje. Serás devuelto a la selección de personaje.',
            onClickButton: () => {
                setCharacter(null);
                setGameConfig(null);
                setSessionEndReason(null);
                navigate(RouterPaths.CHARACTER_SELECTION, { replace: true });
            },
        });

    }

    const { disconnect, isConnected, isReady, worldSessionId } = useGameSocket({ characterId: character?.id, onSessionReplaced: handleSessionReplaced })

    const leaveGame = useCallback(() => {
        disconnect();
        setCharacter(null);
        setGameConfig(null);
        setSessionEndReason(null);
        navigate(RouterPaths.LANDING_PAG, { replace: true });
    }, [disconnect, navigate]);

    const leaveGameToCharacterSelection = useCallback(() => {
        disconnect();
        setCharacter(null);
        setGameConfig(null);
        setSessionEndReason(null);
        navigate(RouterPaths.CHARACTER_SELECTION, { replace: true });
    }, [disconnect, navigate]);

    return (
        <CharacterSessionContext.Provider value={{
            character,
            gameConfig,
            enterGame,
            updateInventoryItemPosition,
            applyEquipmentResponse,
            applyUnequipmentResponse,
            applyEquipmentSlotPurchaseResponse,
            applyEquipmentSelectionResponse,
            applyAttributeIncreaseResponse,
            applyPotionUseResponse,
            applyBuffResponse,
            applyChestResponse,
            runCharacterMutation,
            applySplitInventoryItemResponse,
            applyMergeInventoryItemsResponse,
            applyDiscardInventoryItemResponse,
            isConnected,
            sessionEndReason,
            isReady,
            leaveGame,
            worldSessionId,
            leaveGameToCharacterSelection

        }}>
            {children}
        </CharacterSessionContext.Provider>
    )
}
