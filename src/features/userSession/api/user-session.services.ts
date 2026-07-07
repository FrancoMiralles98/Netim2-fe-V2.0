import { http } from "../../../api/http"
import type { ApiResponse } from "../../../api/types/api-response.type"
import type { UserSession } from "../../auth/types/user-session.types"
import { USER_SESSION_ROUTES } from "./user-session.routes"

export const refreshUserSessionRequest = async (): Promise<UserSession> => {
    const response = await http.get<ApiResponse<UserSession>>(USER_SESSION_ROUTES.refresh())

    return response.data.data
}