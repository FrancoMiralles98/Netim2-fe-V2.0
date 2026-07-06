import z from "zod";

export const loginSchema = z.object({
    username: z
        .string({ error: 'Se necesita asignar un username' })
        .min(1, 'Debes introducir un Username.'),

    password: z
        .string({ error: 'Se necesita asignar una contraseña' })
        .min(1, 'Debes introducir una Contraseña.')
})

export type LoginForm = z.infer<typeof loginSchema>