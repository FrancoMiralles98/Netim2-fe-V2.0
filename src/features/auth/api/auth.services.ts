import { http } from "../../../api/http"
import type { LoginForm } from "../schema/login.schema"
import type { RegisterFormData } from "../schema/register.schema"
import { AUTH_ROUTES } from "./auth.routes"

export const registerRequest = async (body: RegisterFormData) => {
    const response = await http.post(AUTH_ROUTES.register(), body)

    return response
}


export const loginRequest = async (body: LoginForm) => {
    const response = await http.post(AUTH_ROUTES.login(), body)

    return response
}