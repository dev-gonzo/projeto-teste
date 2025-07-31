export interface MidiasRelacionadas {
    id: number;
    tipo: string;
    dataCadastro: string;
    flagSigilo: string;
    codigoBoInquerito: string;
    thumbnailUrl?: string;
    delegado?: {
        id: number;
        nome: string;
    };
    digitador?: {
        id: number;
        nome: string;
    };
    delegaciaOitiva?: {
        id: number;
        nomeDelegacia: string;
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