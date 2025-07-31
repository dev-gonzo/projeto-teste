export enum SituacaoOitiva {
    AguardandoProcessamento = 'AGUARDANDO PROCESSAMENTO',
    Disponivel = 'DISPONÍVEL',
    Aguardando = 'AGUARDE',
    Transcrevendo = 'EM TRANSCREVENDO',
    Aprovada = 'APROVADA',
    ErroTranscricao = 'ERRO DE TRANSCRIÇÃO',
    VideoSemAudio = 'VÍDEO SEM AÚDIO',
    TentativasEsgotadas = 'TENTATIVAS ESGOTADAS',
    MidiaSemAudio = 'MÍDIA SEM ÁUDIO',
    Editando = 'EDITANDO'
}
  
export enum StatusProcessamento {
    Processando = 'Processando',
    Processado = 'Processado',
    ErroProcessamento = 'Erro de processamento',
    Desconhecido = 'Desconhecido'
}