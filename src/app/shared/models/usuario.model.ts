import { AbstractModel, Cargo, UnidadeOperacional, Perfil } from '.';

export interface Usuario extends AbstractModel<number> {
  nome: string;
  rg?: string;
  perfil: Perfil;
  cargo: Cargo;
  celular?: string;
  celularDDD?: string;
  telefone?: string;
  telefoneDDD?: string;
  sexo?: string;
  cpf: string;
  email: string;
  descricao?: string;
  dataNascimento?: string;
  unidadeOperacionalPrincipal: UnidadeOperacional;
  unidadesOperacionais?: UnidadeOperacional[];
  status?: string;
}

export interface UsuarioBasico extends AbstractModel<number> {
  nome: string;
  UnidadeOperacionalPrincipal?: {
    id: number
  }
}
