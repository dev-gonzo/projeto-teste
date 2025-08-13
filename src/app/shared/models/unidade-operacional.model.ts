import { AbstractModel, Municipio, Uf } from '.';

export interface UnidadeOperacional extends AbstractModel<number> {
  nomeUnidadeOperacional: string;
  cep?: string;
  nomeLogradouro?: string;
  numeroLogradouro?: string;
  nomeComplemento?: string;
  nomeBairro?: string;
  municipio?: Municipio;
  uf?: Uf;
  telefoneDDD?: string;
  telefonePrincipal?: string;
  telefoneSecundarioDDD?: string;
  telefoneSecundario?: string;
  nomeResponsavelUnidade?: string;
  status?: string;
}

export interface ListaUnidadeOperacional extends AbstractModel<number> {
  nomeUnidadeOperacional: string;
}

