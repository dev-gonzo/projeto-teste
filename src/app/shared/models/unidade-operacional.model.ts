import { AbstractModel, Endereco, Municipio, Uf } from '.';

export interface UnidadeOperacional extends AbstractModel<number> {
  nomeUnidadeOperacional: string;
  responsavelUnidadeOperacional?: string;
  numeroTelefonePrincipal?: string;
  numeroTelefoneSecundario?: string;
  endereco?: Endereco;
  id?: number;
  status?: string;
}



export interface ListaUnidadeOperacional extends AbstractModel<number> {
  nomeUnidadeOperacional: string;
  responsavelUnidadeOperacional?: string;
  numeroTelefonePrincipal?: string;
  numeroTelefoneSecundario?: string;
  endereco?: Endereco;
}

