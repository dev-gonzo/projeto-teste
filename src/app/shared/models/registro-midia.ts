export interface RegistroMidia {
    ano: string;
    boInquerito: string;
    unidadeOperacional: {id: number, nomeUnidadeOperacional: string};
    unidadeOperacionalBoInquerito: {id: number, nomeUnidadeOperacional: string};
    descricao: string;
    origem: {id: number, descricao: string};
    registroSigiloso: string;
    semAudio: boolean;
    tipoDocumento: {id: number, descricao: string};
    tipoMidia: string;
    arquivo?: File;
    titulo: string;
    id?: number;
}

export interface MidiaCriada {
    id: number;
}