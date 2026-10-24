import { z } from 'zod'

export const loginSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(50, 'Nome de usuário muito longo')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscores'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(50, 'Nome de usuário muito longo')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscores'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
})

export const progressSchema = z.object({
  contentType: z.string().min(1, 'contentType é obrigatório'),
  contentId: z.string().min(1, 'contentId é obrigatório'),
  quality: z.number().int().min(0).max(5, 'Quality deve ser entre 0 e 5'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProgressInput = z.infer<typeof progressSchema>
