import axios from "axios";
import { normalizaApiError } from "./api-error";

export const http = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    timeout: 15000
})

/**
 * Interceptor global de respuestas de Axios.
 *
 * Si la respuesta es exitosa, devuelve la respuesta sin modificar.
 *
 * Si la request falla, normaliza el error mediante `normalizaApiError` y rechaza
 * la promesa con un error controlado por la aplicación. Esto permite que los
 * `catch` reciban un formato consistente:
 *
 * - `status`
 * - `messages`
 *
 * De esta forma, los componentes o hooks pueden mostrar errores fácilmente en
 * un modal reutilizable como `FeedbackModal`.
 */
http.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(normalizaApiError(error))
    }
)