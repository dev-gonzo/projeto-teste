export enum SituacaoOitiva {
    AguardandoProcessamento = 'Aguardando processamento',
    Disponivel = 'DISPONÍVEL',
    Aguardando = 'AGUARDE',
    Transcrevendo = 'EM TRANSCREVENDO',
    Aprovada = 'APROVADA',
    ErroTranscricao = 'Erro de transcrição',
    VideoSemAudio = 'Vídeo sem áudio',
    TentativasEsgotadas = 'Tentativas esgotadas',
    MidiaSemAudio = 'MÍDIA SEM ÁUDIO',
    Editando = 'EDITANDO'
}
  
export enum StatusProcessamento {
    Processando = 'Processando',
    Processado = 'Processado',
    ErroProcessamento = 'Erro de processamento',
    Desconhecido = 'Desconhecido'
}