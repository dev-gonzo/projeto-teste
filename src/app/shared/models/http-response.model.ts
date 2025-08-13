export interface ResponseSuccessHttp {
  mensagem?: string;
}

export interface ErrorResponseHttp {
  campo?: string;
  erro?: string;
}

export interface ValidateTokenResponse {
  ativado: boolean;
  mensagem: string;
  perfil: string;
  token: string;
}