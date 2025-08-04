import { Usuario } from "./usuario.model";

export interface Oitiva {
    id: number,
    status: string,
    nomeUnidadeOperacionalBoInquerito: string,
    nomeUnidadeOperacionalOitiva: string,
    codigoBoInquerito: string,
    ano: number,
    nomeDepoente: string,
    respondavelUnidade: Usuario,
    digitador: Usuario,
    flagSigilo: string,
    dataCadastro: string,
    situacaoTranscricao: string,
    situacaoProcessamento?: string
}

export interface DadosBasicos{
    ano: number,
    boInquerito: string,
    unidadeOperacionalBoInquerito: {id: number, nomeUnidadeOperacional: string},
    unidadeOperacionalOitiva: {id: number, nomeUnidadeOperacional: string},
    respondavelUnidade: {id: number, nome: string, UnidadeOperacionalPrincipal: {id: number}},
    depoente: {id: number, nome: string, unidadeOperacionalPrincipal: {id: number}},
    digitador: {id: number, nome: string, unidadeOperacionalPrincipal: {id: number}},
    sigilo: {opcao: string, valor: boolean},
}

export interface OitivaGeral {
    usuario: {
        nome: string;
        id: number;
        unidadeOperacionalPrincipal: {
          id: number;
        };
      };
    respondavelUnidade: {
        nome: string;
        id: number;
        unidadeOperacionalPrincipal: {
            id: number;
        };
    };
    digitador: {
        id: number;
        nome: string;
        unidadeOperacionalPrincipal: {
            id: number;
        };
    };
    unidadeOperacionalBoInquerito: {
        id: number;
    };
    unidadeOperacionalOitiva: {
        id: number;
    };
    codigoBoInquerito: string;
    ano: number;
    nomeDepoente: string;
    flagSigilo: boolean;
    dataCadastro: string;
    dataInicioDepoimento: string;
    dataFimDepoimento: string; 
    tempoDuracaoDepoimento: string
}

export interface LogOitiva {
    id: number;
    idRecurso: number;
    funcionalidade: string;
    acao: string;
    dataAcao: string;
    horaAcao: string;
    ip: string;
    nomeUsuario: string;
}

export interface Paginacao {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface LogsOitivaResponse {
    content: LogOitiva[];
    page: Paginacao;
}

export interface FiltrosOitivaLogs {
    usuario?: number;
    acao?: string;
    dataAcao?: string;
    ip?: string;
  }

export interface OitivaCriacaoResponse {
    mensagem: string;
    id: number;
}

export interface DetalhesOitiva{
    id: number;
    codigoBoInquerito: string;
    nomeDepoente: string;
    nomeResponsavelUnidade: string;
    nomeDigitador: string;
    dataCadastro: string;
    flagSigilo: boolean;
    nomeUnidadeOperacionalOitiva: string;
    transcricao: TranscricaoOitiva[];
    nomeOitiva: string | null;
    descricaoOitiva: string | null;
}

export interface TranscricaoOitiva {
    transcricao: string;
    label: string;
    timestampInicio: string;
    timestampFim: string;
    posicao: number;
}

export interface ResponseTranscricaoOitiva extends Omit<DetalhesOitiva, 'transcricao'>{
    transcricao: string;
}