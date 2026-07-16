import z from "zod";

export const creationCharacterSchema = z.object({
    nombre: z.
        string('Debes asignarle un nombre a tu personaje.').
        min(3, 'El nombre debe tener al menos 3 caracteres.').
        max(13, 'El nombre debe tener un máximo de 13 caracteres.').
        regex(/^[A-Za-z0-9]+$/i, { error: 'El nombre solo de tener letras y/o números.' }),
})

export type creationCharacterSchemaType = z.infer<typeof creationCharacterSchema>