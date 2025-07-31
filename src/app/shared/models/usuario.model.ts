import { AbstractModel, Cargo, Delegacia, Perfil } from '.';

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
  delegaciaPrincipal: Delegacia;
  delegacias?: Delegacia[];
  status?: string;
}

export interface UsuarioBasico extends AbstractModel<number> {
  nome: string;
  delegaciaPrincipal?: {
    id: number
  }
}
