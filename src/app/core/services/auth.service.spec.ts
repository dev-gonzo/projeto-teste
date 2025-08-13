import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';
import { keys } from '../../shared/utils/variables';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let cryptoServiceSpy: jasmine.SpyObj<CryptoService>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;

  const API_URL = environment.apiUrl;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const cryptoSpyObj = jasmine.createSpyObj('CryptoService', [
      'hashKey',
      'encrypt',
      'decrypt',
    ]);
    const cookieSpyObj = jasmine.createSpyObj('CookieService', [
      'get',
      'set',
      'check',
      'delete',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: CryptoService, useValue: cryptoSpyObj },
        { provide: CookieService, useValue: cookieSpyObj },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cryptoServiceSpy = TestBed.inject(
      CryptoService
    ) as jasmine.SpyObj<CryptoService>;
    cookieServiceSpy = TestBed.inject(
      CookieService
    ) as jasmine.SpyObj<CookieService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('deve fazer uma requisição POST e lidar com o login bem-sucedido', () => {
      const credentials = { cpf: '123', senha: 'abc' };
      const apiResponse = { token: 'mock-token' };
      const expectedResponse = { success: true, message: 'null', token: '' };

      let eventFired = false;
      spyOn(service, 'setAppToken').and.callThrough();

      service.loggedInEvent.subscribe(() => {
        eventFired = true;
      });

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/cadastros/auth/login`
      );
      req.flush(apiResponse);

      expect(service.setAppToken).toHaveBeenCalledWith('mock-token');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/validar-token']);
      expect(eventFired).toBe(true);
    });

    it('não deve armazenar o token, navegar ou emitir evento se a resposta não tiver um token', () => {
      const credentials = { cpf: '123', senha: 'abc' };
      const apiResponse = { message: 'Invalid credentials' };
      const expectedResponse = { success: false, message: 'Invalid credentials', token: '' };

      let eventFired = false;
      spyOn(service, 'setAppToken');

      service.loggedInEvent.subscribe(() => {
        eventFired = true;
      });

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/cadastros/auth/login`
      );
      req.flush(apiResponse);

      expect(service.setAppToken).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(eventFired).toBe(false);
    });
  });

  describe('logout', () => {
    it('deve chamar DELETE /logout, remover token, navegar e emitir evento', () => {
      const mockToken = 'mock-token';
      spyOn(service, 'getAppToken').and.returnValue(mockToken);
      spyOn(service, 'removeAppToken').and.callThrough();

      let eventFired = false;
      service.loggedInEvent.subscribe(() => {
        eventFired = true;
      });

      service.logout().subscribe((response) => {
        expect(response).toEqual({ success: true, message: null });
      });

      const req = httpTestingController.expectOne(
        `${API_URL}/cadastros/auth/logout`
      );
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

      req.flush({ success: true });

      expect(service.removeAppToken).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(eventFired).toBe(true);
    });

    it('deve navegar para login se não houver token', () => {
      spyOn(service, 'getAppToken').and.returnValue(null);

      service.logout().subscribe((response) => {
        expect(response).toBeNull();
      });

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('getToken', () => {
    it('deve retornar o token do cookie', () => {
      spyOn(service, 'getAppToken').and.returnValue('token-cookie');
      expect(service.getToken()).toBe('token-cookie');
    });
  });

  describe('Gerenciamento de App Token (Cookie)', () => {
    const mockHashedKey = 'hashedCookieKey';
    const mockToken = 'my-app-token';
    const mockEncryptedToken = 'encrypted-token-value';

    beforeEach(() => {
      cryptoServiceSpy.hashKey.and.returnValue(mockHashedKey);
      cryptoServiceSpy.encrypt.and.returnValue(mockEncryptedToken);
      cryptoServiceSpy.decrypt.and.returnValue(mockToken);
    });

    it('setAppToken deve criptografar o token e a chave e chamar cookieService.set', () => {
      service.setAppToken(mockToken);

      expect(cryptoServiceSpy.encrypt).toHaveBeenCalledWith(mockToken);
      expect(cryptoServiceSpy.hashKey).toHaveBeenCalledWith(keys.COOKIE_TOKEN);
      expect(cookieServiceSpy.set).toHaveBeenCalledWith(
        mockHashedKey,
        mockEncryptedToken,
        { expires: jasmine.any(Date), path: '/' }
      );
    });

    it('getAppToken deve recuperar e descriptografar o token usando cookieService', () => {
      cookieServiceSpy.check.and.returnValue(true);
      cookieServiceSpy.get.and.returnValue(mockEncryptedToken);

      const token = service.getAppToken();

      expect(cookieServiceSpy.check).toHaveBeenCalledWith(mockHashedKey);
      expect(cookieServiceSpy.get).toHaveBeenCalledWith(mockHashedKey);
      expect(cryptoServiceSpy.decrypt).toHaveBeenCalledWith(mockEncryptedToken);
      expect(token).toBe(mockToken);
    });

    it('getAppToken deve retornar nulo se o cookie não for encontrado', () => {
      cookieServiceSpy.check.and.returnValue(false);

      const token = service.getAppToken();

      expect(token).toBeNull();
      expect(cookieServiceSpy.get).not.toHaveBeenCalled();
      expect(cryptoServiceSpy.decrypt).not.toHaveBeenCalled();
    });

    it('removeAppToken deve chamar cookieService.delete com a chave e o caminho corretos', () => {
      service.removeAppToken();

      expect(cryptoServiceSpy.hashKey).toHaveBeenCalledWith(keys.COOKIE_TOKEN);
      expect(cookieServiceSpy.delete).toHaveBeenCalledWith(mockHashedKey, '/');
    });
  });

  describe('isAuthenticatedUser', () => {
    it('deve retornar true quando isAuthenticatedToken retorna true', () => {
      spyOn(service, 'isAuthenticatedToken').and.returnValue(true);
      expect(service.isAuthenticatedUser()).toBeTrue();
    });

    it('deve retornar false quando isAuthenticatedToken retorna false', () => {
      spyOn(service, 'isAuthenticatedToken').and.returnValue(false);
      expect(service.isAuthenticatedUser()).toBeFalse();
    });
  });

  describe('isAuthenticatedToken', () => {
    it('deve retornar true quando cookieService.check retorna true', () => {
      cryptoServiceSpy.hashKey.and.returnValue('hashed-key');
      cookieServiceSpy.check.and.returnValue(true);

      const result = service.isAuthenticatedToken();

      expect(cookieServiceSpy.check).toHaveBeenCalledWith('hashed-key');
      expect(result).toBeTrue();
    });

    it('deve retornar false quando cookieService.check retorna false', () => {
      cryptoServiceSpy.hashKey.and.returnValue('hashed-key');
      cookieServiceSpy.check.and.returnValue(false);

      const result = service.isAuthenticatedToken();

      expect(cookieServiceSpy.check).toHaveBeenCalledWith('hashed-key');
      expect(result).toBeFalse();
    });
  });
});
