export interface Upload{
    id: number,
    status: string,
    nomeUnidadeOperacionalBoInquerito: string,
    nomeUnidadeOperacionalOitiva: string,
    codigoBoInquerito: string,
    ano: number,
    origemMidia: string,
    tipoMidia: string,
    midiaSemAudio: boolean,
    flagSigilo: boolean,
    dataCadastro: string,
    situacaoTranscricao: string,
    situacaoProcessamento?: string,
    descricaoMidia: string,
}

export interface LogsUploadResponse {
    content: LogUpload[];
    page: Paginacao;
};

export interface LogUpload {
    id: number;
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

export interface FiltrosUploadLogs {
    idUsuario?: string;
    acao?: string;
    dataAcao?: string;
    ip?: string;
  }