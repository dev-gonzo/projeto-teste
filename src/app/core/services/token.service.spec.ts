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

  describe('validateToken', () => {
    it('deve fazer uma requisição POST com o corpo correto e emitir a resposta via Observable', (done) => {
      const mockBody = { token: '123456', codigo: '123' };
      const mockResponse = { sessionToken: 'token-validado-123' };

      service.validateToken(mockBody).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/cadastros/auth/validar-token`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });
  });

});
