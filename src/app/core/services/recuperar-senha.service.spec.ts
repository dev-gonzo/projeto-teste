import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { RecuperarSenhaService } from './recuperar-senha.service';
import { environment } from '../../../environments/environment';

describe('RecuperarSenhaService', () => {
  let service: RecuperarSenhaService;
  let httpTestingController: HttpTestingController;
  const API_URL = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecuperarSenhaService],
    });
    service = TestBed.inject(RecuperarSenhaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('solicitarRecuperacaoSenha', () => {
    it('deve fazer uma requisição POST com o CPF e o caminho relativo', () => {
      const mockCpf = '12345678900';
      const mockResponse = { mensagem: 'E-mail de recuperação enviado.' };

      service.solicitarRecuperacaoSenha(mockCpf).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/autenticacao/recuperar-senha`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        cpf: mockCpf,
        caminhoRelativo: '/avs-portaldemidias/auth/criar-senha',
      });

      req.flush(mockResponse);
    });
  });

  describe('validarRecuperacaoSenha', () => {
    it('deve fazer uma requisição POST com o token e a nova senha', () => {
      const mockToken = 'um-token-valido';
      const mockSenha = 'umaSenhaForte123!';
      const mockResponse = { mensagem: 'Senha alterada com sucesso.' };

      service.validarRecuperacaoSenha(mockToken, mockSenha).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/autenticacao/recuperar-senha/validar`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        codigo: mockToken,
        senha: mockSenha,
      });

      req.flush(mockResponse);
    });
  });
});