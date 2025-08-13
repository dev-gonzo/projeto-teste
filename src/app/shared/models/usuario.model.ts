import { AbstractModel } from '.';

export interface Usuario extends AbstractModel<number> {
  nome: string;
  rg?: string;
  celular?: string;
  telefone?: string;
  genero: string;
  cpf: string;
  estadoCivil: string;
  email: string;
  descricao?: string;
  dataNascimento?: string;
  unidadeOperacionalId?: number;
  cargoId: number;
  observacao?: string;
}

export interface UsuarioBasico extends AbstractModel<number> {
  nome: string;
  UnidadeOperacionalPrincipal?: {
    id: number
  }
}
