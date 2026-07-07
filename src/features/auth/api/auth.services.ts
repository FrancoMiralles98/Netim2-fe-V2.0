import { http } from "../../../api/http"
import type { ApiResponse } from "../../../api/types/api-response.type"
import type { LoginForm } from "../schema/login.schema"
import type { RegisterFormData } from "../schema/register.schema"
import type { UserSession } from "../types/user-session.types"
import { AUTH_ROUTES } from "./auth.routes"

export const registerRequest = async (body: RegisterFormData) => {
    const response = await http.post(AUTH_ROUTES.register(), body)

    return response
}


export const loginRequest = async (body: LoginForm): Promise<UserSession> => {
    const response = await http.post<ApiResponse<UserSession>>(AUTH_ROUTES.login(), body)
    
    return response.data.data
}