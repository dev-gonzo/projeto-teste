export interface MidiasRelacionadas {
    id: number;
    tipo: string;
    dataCadastro: string;
    flagSigilo: string;
    codigoBoInquerito: string;
    thumbnailUrl?: string;
    responsavelUnidade?: {
        id: number;
        nome: string;
    };
    digitador?: {
        id: number;
        nome: string;
    };
    UnidadeOperacionalOitiva?: {
        id: number;
        nomeUnidadeOperacional: string;
    }
}

export interface PageInfo {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface MidiasRelacionadasResponse {
    content: MidiasRelacionadas[];
    page: PageInfo;
}