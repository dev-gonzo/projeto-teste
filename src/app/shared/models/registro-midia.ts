export interface RegistroMidia {
    ano: string;
    boInquerito: string;
    delegacia: {id: number, nomeDelegacia: string};
    delegaciaBoInquerito: {id: number, nomeDelegacia: string};
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