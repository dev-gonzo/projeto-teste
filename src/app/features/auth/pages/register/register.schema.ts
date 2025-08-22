import * as yup from 'yup';

export interface RegisterFormData {
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  telefone: string;
  celular: string;
  senha: string;
  confirmarSenha: string;
}

export const registerSchema = yup.object({
  nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ter um formato válido')
    .max(100, 'E-mail deve ter no máximo 100 caracteres'),
  
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve ter um formato válido (000.000.000-00)'),
  
  rg: yup
    .string()
    .required('RG é obrigatório')
    .matches(/^\d{2}\.\d{3}\.\d{3}-\d{1}$/, 'RG deve ter um formato válido (00.000.000-0)'),
  
  telefone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\) \d{4}-\d{4}$/, 'Telefone deve ter um formato válido ((00) 0000-0000)'),
  
  celular: yup
    .string()
    .required('Celular é obrigatório')
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Celular deve ter um formato válido ((00) 00000-0000)'),
  
  senha: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .matches(/\d/, 'Senha deve conter pelo menos um número')
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Senha deve conter pelo menos um caractere especial'),
  
  confirmarSenha: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('senha')], 'As senhas devem ser iguais'),
});