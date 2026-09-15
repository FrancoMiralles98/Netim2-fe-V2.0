import type { FightResponse } from "netim2-shared"
import { http } from "../../../api/http"
import type { ApiResponse } from "../../../api/types/api-response.type"
import type { FighterFightSummary } from "../../fightResult/types/fighter-fight-summary.types"
import { FIGHT_ROUTES } from "./fight.routes"

type FightResponseWithSummary = FightResponse & {
    fighterFightSummary: FighterFightSummary[];
};

export const fightLabRequest = async() => {
    const request = await http.get<ApiResponse<FightResponseWithSummary>>(FIGHT_ROUTES.fightLab())

    return request.data.data
}
