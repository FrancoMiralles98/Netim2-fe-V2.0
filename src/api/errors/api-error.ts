import axios from "axios";

export class ApiError extends Error {
    status: number;
    messages: string[]

    constructor(status: number, messages: string[]) {
        super(messages[0] ?? 'Error inesperado')
        this.status = status,
        this.messages = messages
    }
}

/**
 * Normaliza cualquier error recibido desde Axios o desde código externo
 * y lo transforma en una instancia de `ApiError`.
 *
 * Esta función permite que todos los `catch` de la aplicación reciban un formato
 * de error consistente, independientemente de si:
 *
 * - El servidor respondió con un error HTTP.
 * - No hubo respuesta del servidor.
 * - El error no proviene de Axios.
 *
 * @param error
 * Error desconocido capturado durante una request.
 *
 * @returns
 * Una instancia de `ApiError` con `status` y `messages` normalizados.
 */
export const normalizaApiError = (error: unknown): ApiError => {
    if (!axios.isAxiosError(error)) {
        return new ApiError(500, ['Ocurrio un error inesperado.'])
    }

    if (!error.response) {
        return new ApiError(0, ['No se pudo conectar con el servidor.'])
    }

    const status = error.response.status

    //Tiene este formato porque en el servidor, el filterError lo devuelve asi
    const data = error.response.data as {
        message?: string | string[]
        errors?: string | string[] | Record<string, string>
        success?: boolean
    }

    const messages = extractMessages(data)

    return new ApiError(status, messages)
}

/**
 * Extrae y normaliza los mensajes de error contenidos en la respuesta del backend.
 *
 * Soporta distintos formatos comunes de respuesta:
 *
 * - `errors` como array de strings.
 * - `errors` como string.
 * - `errors` como objeto de campos.
 * - `message` como array de strings.
 * - `message` como string.
 * - `error` como string.
 *
 * @param data
 * Cuerpo de la respuesta de error recibida desde el backend.
 *
 * @returns
 * Array de mensajes de error normalizados. Si no encuentra mensajes válidos,
 * devuelve un array vacío.
 */
function extractMessages(data: {
    message?: string | string[]
    errors?: string | string[] | Record<string, string>
    error?: string
}): string[] {
    if (Array.isArray(data.errors)) {
        return data.errors
    }

    if (typeof data.errors === 'string') {
        return [data.errors]
    }

    if (data.errors && typeof data.errors === 'object') {
        return Object.values(data.errors)
    }

    if (Array.isArray(data.message)) {
        return data.message
    }

    if (typeof data.message === 'string') {
        return [data.message]
    }

    if (typeof data.error === 'string') {
        return [data.error]
    }

    return []
}