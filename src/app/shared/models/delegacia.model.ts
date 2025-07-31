import { AbstractModel, Municipio, Uf } from '.';

export interface Delegacia extends AbstractModel<number> {
  nomeDelegacia: string;
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
  nomeDelegado?: string;
  status?: string;
}
