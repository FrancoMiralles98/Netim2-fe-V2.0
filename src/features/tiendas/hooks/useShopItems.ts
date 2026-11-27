import { useEffect, useState } from "react";
import type { GetShopItemsResponse, NpcShopId } from "netim2-shared";
import { getShopItemsRequest } from "../api/shop.services";

type ShopState =
    | { shopId: NpcShopId; status: "ready"; data: GetShopItemsResponse }
    | { shopId: NpcShopId; status: "error"; error: unknown };

export const useShopItems = (shopId: NpcShopId) => {
    const [state, setState] = useState<ShopState | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            try {
                const data = await getShopItemsRequest({ shopId }, controller.signal);
                if (!controller.signal.aborted) setState({ shopId, status: "ready", data });
            } catch (error) {
                if (!controller.signal.aborted) setState({ shopId, status: "error", error });
            }
        };
        void load();
        return () => controller.abort();
    }, [shopId, attempt]);

    const current = state?.shopId === shopId ? state : null;
    const data = current?.status === "ready" ? current.data : null;

    return {
        data,
        items: data?.items ?? [],
        isLoading: current === null,
        error: current?.status === "error" ? current.error : null,
        retry: () => {
            setState(null);
            setAttempt(value => value + 1);
        },
    };
};
