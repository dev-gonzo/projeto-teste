import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ter um formato válido')
    .min(3, 'Mínimo de 3 caracteres')
    .max(100, 'E-mail deve ter no máximo 100 caracteres'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
