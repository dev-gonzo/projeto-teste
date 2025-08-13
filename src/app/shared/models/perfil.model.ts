import { AbstractModel } from '.';

export interface Perfil extends AbstractModel<number> {
  descricao: string;
}

export enum PermissaoPerfil {
  ADMINISTRADOR = 'ADMINISTRADOR',
  UNIDADE_OPERACIONAL = 'UNIDADE_OPERACIONAL',
  AUTOCADASTRO = 'AUTOCADASTRO',
}

export const RotasPermitidasPorPerfil: Record<PermissaoPerfil, string[]> = {
  [PermissaoPerfil.ADMINISTRADOR]: ['home', 'unidade-operacional', 'auth'],
  [PermissaoPerfil.UNIDADE_OPERACIONAL]: ['home', 'unidade-operacional'],
  [PermissaoPerfil.AUTOCADASTRO]: ['home', 'auth'],
};
