import { AbstractModel } from '.';

export interface Uf extends AbstractModel<number> {
  codigoIbge: number;
  nome: string;
  sigla: string;
}

export interface Endereco extends AbstractModel<number> {
  cep?: string;
  logradouro?: string;
  numero?: number;
  complemento?: string;
  bairro?: string;
  municipio?: Municipio;
  estadoSigla?: string;
  municipioNome?: string;
}

export interface Municipio extends AbstractModel<number> {
  codigoIbge: number;
  nome: string;
  uf: Uf;
}

export interface ApiCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado?: string;
  ibge: string;
}

export function mapApiCepToEndereco(apiData: ApiCepResponse): Endereco {
  return {
    id: 0,
    cep: apiData.cep,
    logradouro: apiData.logradouro,
    bairro: apiData.bairro,
    complemento: apiData.complemento,
    municipio: {
      id: 0,
      codigoIbge: Number(apiData.ibge),
      nome: apiData.localidade,
      uf: {
        id: 0,
        codigoIbge: Number(apiData.ibge.slice(0, 2)),
        nome: apiData.estado || '',
        sigla: apiData.uf
      }
    }
  };
}
