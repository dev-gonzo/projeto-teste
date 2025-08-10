import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

describe('TokenService', () => {
  let service: TokenService;
  let httpTestingController: HttpTestingController;
  const API_URL = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TokenService],
    });
    service = TestBed.inject(TokenService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('Gerenciamento de Token Interno', () => {
    it('deve definir e obter um token corretamente', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      service.setToken(mockToken);
      expect(service.getToken()).toBe(mockToken);
    });

    it('deve limpar o token, fazendo com que getToken retorne uma string vazia', () => {
      const mockToken = 'um-token-qualquer';
      service.setToken(mockToken);
      expect(service.getToken()).toBe(mockToken);

      service.clearToken();
      expect(service.getToken()).toBe('');
    });

    it('deve retornar uma string vazia se nenhum token foi definido', () => {
      expect(service.getToken()).toBe('');
    });
  });

  describe('requestToken', () => {
    it('deve fazer uma requisição POST e emitir a resposta via Observable', (done) => {
      const mockBody = { email: 'teste@exemplo.com' };
      const mockResponse = { success: true, message: 'Token enviado' };

      service.requestToken(mockBody).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/cadastros/auth/request-token`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });
  });

  describe('validateToken', () => {
    it('deve fazer uma requisição POST com o corpo correto e emitir a resposta via Observable', (done) => {
      const mockBody = { token: '123456', jwt: 'jwt-token-aqui' };
      const mockResponse = { sessionToken: 'token-validado-123' };

      service.validateToken(mockBody).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/cadastros/auth/validate-token`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });
  });

});
