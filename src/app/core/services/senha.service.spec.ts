import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SenhaService } from './senha.service';
import { environment } from '../../../environments/environment';

describe('SenhaService', () => {
  let service: SenhaService;
  let httpTestingController: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SenhaService],
    });
    service = TestBed.inject(SenhaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('criarSenha', () => {
    it('deve chamar o endpoint de criação de senha com o corpo e token corretos, e com o método POST', () => {
      const mockIdUsuario = 123;
      const mockSenha = 'senhaForte@123';
      const mockToken = 'um-token-jwt-qualquer';
      const mockResponse = 'Senha criada com sucesso.';

      const expectedBody = {
        idUsuario: mockIdUsuario,
        senha: mockSenha,
        token: mockToken, 
      };

      service.criarSenha(mockIdUsuario, mockSenha, mockToken).subscribe((response) => { 
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `${baseUrl}/cadastros/auth/create-senha`
      );

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody); 
      expect(req.request.responseType).toBe('text'); 

      req.flush(mockResponse);
    });
  });
});