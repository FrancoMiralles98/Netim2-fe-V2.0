import { http } from "../../../api/http"
import type { RegisterFormData } from "../schema/register.schema"
import { AUTH_ROUTES } from "./auth.routes"

export const registerRequest = async (body: RegisterFormData) => {
    const response = await http.post(AUTH_ROUTES.register(),body)

    return response
}