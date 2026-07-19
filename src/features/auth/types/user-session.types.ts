import type { ReinosNames } from "netim2-shared";

export interface UserSession {
    username: string;
    email: string;
    md: number;
    role: string;
    yang: number;
    reino?: ReinosNames
    almacen: [];
    almacenItemShop: [];
}