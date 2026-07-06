import z from "zod";

export const registerSchema = z.object({
    username: z
        .string({ error: 'se requiere el campo: username.' })
        .min(3, 'El username debe tener como minimo 3 caracteres.')
        .max(15, 'el username debe tener como maximo 15 caracteres.')
        .regex(/[A-Za-z0-9]/i, { error: 'El nombre solo de tener letras y/o números.' }),

    password: z
        .string({ error: 'se requiere el campo: contraseña.' })
        .min(5, 'La contraseña debe tener al menos 5 caracteres.')
        .max(30, 'la contraseña puede tener máximo 30 caracteres.')
        .regex(/^\S+$/, 'No se pueden usar espacios en blanco en la contraseña'),

    email: z
        .email({ error: 'el email debe ser un email válido.' }),

    codigo: z
        .string({ error: 'Se requiere el campo: codigo.' })
        .length(8, 'El código debe tener 8 números.')
        .regex(/^\d+$/, 'El código solo puede contener números.'),
})

export type RegisterFormData = z.infer<typeof registerSchema>