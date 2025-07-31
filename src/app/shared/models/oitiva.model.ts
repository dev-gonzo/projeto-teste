import { Usuario } from "./usuario.model";

export interface Oitiva {
    id: number,
    status: string,
    nomeDelegaciaBoInquerito: string,
    nomeDelegaciaOitiva: string,
    codigoBoInquerito: string,
    ano: number,
    nomeDepoente: string,
    delegado: Usuario,
    digitador: Usuario,
    flagSigilo: string,
    dataCadastro: string,
    situacaoTranscricao: string,
    situacaoProcessamento?: string
}

export interface DadosBasicos{
    ano: number,
    boInquerito: string,
    delegaciaBoInquerito: {id: number, nomeDelegacia: string},
    delegaciaOitiva: {id: number, nomeDelegacia: string},
    delegado: {id: number, nome: string, delegaciaPrincipal: {id: number}},
    depoente: {id: number, nome: string, delegaciaPrincipal: {id: number}},
    digitador: {id: number, nome: string, delegaciaPrincipal: {id: number}},
    sigilo: {opcao: string, valor: boolean},
}

export interface OitivaGeral {
    usuario: {
        nome: string;
        id: number;
        delegaciaPrincipal: {
          id: number;
        };
      };
    delegado: {
        nome: string;
        id: number;
        delegaciaPrincipal: {
            id: number;
        };
    };
    digitador: {
        id: number;
        nome: string;
        delegaciaPrincipal: {
            id: number;
        };
    };
    delegaciaBoInquerito: {
        id: number;
    };
    delegaciaOitiva: {
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
    nomeDelegado: string;
    nomeDigitador: string;
    dataCadastro: string;
    flagSigilo: boolean;
    nomeDelegaciaOitiva: string;
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