import type { GetMobInfoRequest } from "netim2-shared";

export const EXPLORE_ROUTES = {
    mobsByUbication: () => "mob",
    mobInfo: ({ idMob }: GetMobInfoRequest) => `mob/${encodeURIComponent(idMob)}`,
};
