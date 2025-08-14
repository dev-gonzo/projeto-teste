import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { ValidateTokenResponse } from '../../shared/models';

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

  describe('validateToken', () => {
    it('deve fazer uma requisição POST para a URL correta com o corpo e retornar a resposta', () => {
      const mockBody = { token: '123456', codigo: '123' };
      const mockResponse: ValidateTokenResponse = { token: '123456', ativado: true, perfil: 'admin', mensagem: 'ok' };

      service.validateToken(mockBody).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/autenticacao/token/validar`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });
  });
});