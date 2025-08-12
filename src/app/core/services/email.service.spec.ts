import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { EmailService } from './email.service';
import { environment } from '../../../environments/environment';

describe('EmailService', () => {
  const API_URL = environment.apiUrl;

  let service: EmailService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmailService],
    });
    service = TestBed.inject(EmailService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('enviarEmail', () => {
    it('deve chamar o endpoint de envio de email com o corpo correto e método POST', () => {
      const mockEmail = 'teste@exemplo.com';
      const mockResponse = 'Email enviado com sucesso';
      const expectedBody = {
        destinatario: mockEmail,
        moduloAdm: true,
      };

      service.enviarEmail(mockEmail).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${API_URL}/cadastros/emails/envioEmail`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.responseType).toBe('text');

      req.flush(mockResponse);
    });
  });

  describe('validarEmail', () => {
    it('deve chamar o endpoint de verificação de email com o token correto e método GET', () => {
      const mockToken = 'meu-token-de-validacao';
      const mockResponse = { success: true, message: 'Email validado' };

      service.validarEmail(mockToken).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${API_URL}/cadastros/emails/verificarEmail/${mockToken}`);

      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });
});