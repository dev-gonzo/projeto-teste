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
import { LoginResponse } from '../../shared/models';

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
    const credentials = { cpf: '123', senha: 'abc' };

    it('deve fazer login, armazenar token/perfil, navegar para /home e emitir evento quando o usuário está ativado', () => {
      const apiResponse: LoginResponse = { token: 'mock-token', ativado: true, perfil: 'admin', mensagem: '' };
      let eventFired = false;
      spyOn(service, 'setAppToken').and.callThrough();
      spyOn(service, 'setPermissaoPerfil').and.callThrough();

      service.loggedInEvent.subscribe(() => eventFired = true);

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(apiResponse);
      });

      const req = httpTestingController.expectOne(`${API_URL}/autenticacao/token`);
      expect(req.request.method).toBe('POST');
      req.flush(apiResponse);

      expect(service.setAppToken).toHaveBeenCalledWith('mock-token');
      expect(service.setPermissaoPerfil).toHaveBeenCalledWith('admin');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      expect(eventFired).toBe(true);
    });

    it('deve armazenar token, mensagem e navegar para /auth/validar-token quando o usuário não está ativado', () => {
      const apiResponse: LoginResponse = { token: 'mock-token', ativado: false, perfil: 'user', mensagem: 'Ative sua conta' };
      spyOn(service, 'setAppToken').and.callThrough();
      spyOn(service, 'setMensagemLogin').and.callThrough();

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(apiResponse);
      });

      const req = httpTestingController.expectOne(`${API_URL}/autenticacao/token`);
      expect(req.request.method).toBe('POST');
      req.flush(apiResponse);

      expect(service.setAppToken).toHaveBeenCalledWith('mock-token');
      expect(service.setMensagemLogin).toHaveBeenCalledWith('Ative sua conta');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/validar-token']);
    });

    it('não deve navegar ou definir token se a resposta não tiver um token', () => {
      const apiResponse: Partial<LoginResponse> = { mensagem: 'Credenciais inválidas' };
      spyOn(service, 'setAppToken');

      service.login(credentials).subscribe({
        next: () => fail('Deveria ter lançado erro!'),
        error: (err) => {
          expect(err.message).toBe('Resposta de login inválida do servidor.');
        }
      });

      const req = httpTestingController.expectOne(`${API_URL}/autenticacao/token`);
      expect(req.request.method).toBe('POST');
      req.flush(apiResponse);

      expect(service.setAppToken).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('deve chamar DELETE com token, remover dados, navegar para login e emitir evento', () => {
      const mockToken = 'mock-token';
      spyOn(service, 'getAppToken').and.returnValue(mockToken);
      spyOn(service, 'removeAppToken').and.callThrough();
      spyOn(service, 'removePermissaoPerfil').and.callThrough();
      let eventFired = false;
      service.loggedInEvent.subscribe(() => {
        eventFired = true;
      });

      service.logout().subscribe((response) => {
        expect(response).toEqual({ success: true, message: null });
      });

      const req = httpTestingController.expectOne(`${API_URL}/autenticacao/token/${mockToken}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null); 

      expect(service.removeAppToken).toHaveBeenCalledTimes(1);
      expect(service.removePermissaoPerfil).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(eventFired).toBe(true);
    });

    it('deve navegar para login e remover perfil se não houver token', () => {
      spyOn(service, 'getAppToken').and.returnValue(null);
      spyOn(service, 'removePermissaoPerfil').and.callThrough();

      service.logout().subscribe((response) => {
        expect(response).toEqual({ success: true, message: null });
      });

      httpTestingController.expectNone(`${API_URL}/autenticacao/token`);
      expect(service.removePermissaoPerfil).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Gerenciamento de Mensagem de Login', () => {
    it('deve definir e obter a mensagem de login', () => {
      const mensagem = 'Por favor, valide seu token.';
      service.setMensagemLogin(mensagem);
      expect(service.getMensagemLogin()).toBe(mensagem);
    });

    it('getMensagemLogin deve retornar null inicialmente', () => {
      expect(service.getMensagemLogin()).toBeNull();
    });
  });

  describe('Gerenciamento de Permissão de Perfil (Cookie)', () => {
    const mockHashedKey = 'hashedPermissaoKey';
    const mockPermissao = 'admin';
    const mockEncryptedPermissao = 'encrypted-permissao-value';

    beforeEach(() => {
      cryptoServiceSpy.hashKey.withArgs(keys.COOKIE_PERMISSAO).and.returnValue(mockHashedKey);
      cryptoServiceSpy.encrypt.withArgs(mockPermissao).and.returnValue(mockEncryptedPermissao);
      cryptoServiceSpy.decrypt.withArgs(mockEncryptedPermissao).and.returnValue(mockPermissao);
    });

    it('setPermissaoPerfil deve criptografar e definir o cookie de permissão', () => {
      service.setPermissaoPerfil(mockPermissao);
      expect(cryptoServiceSpy.hashKey).toHaveBeenCalledWith(keys.COOKIE_PERMISSAO);
      expect(cryptoServiceSpy.encrypt).toHaveBeenCalledWith(mockPermissao);
      expect(cookieServiceSpy.set).toHaveBeenCalledWith(
        mockHashedKey,
        mockEncryptedPermissao,
        { expires: jasmine.any(Date), path: '/' }
      );
    });

    it('getPermissaoPerfil deve ler e descriptografar a permissão do cookie', () => {
      cookieServiceSpy.check.withArgs(mockHashedKey).and.returnValue(true);
      cookieServiceSpy.get.withArgs(mockHashedKey).and.returnValue(mockEncryptedPermissao);

      const permissao = service.getPermissaoPerfil();

      expect(cryptoServiceSpy.decrypt).toHaveBeenCalledWith(mockEncryptedPermissao);
      expect(permissao).toBe(mockPermissao);
    });

    it('removePermissaoPerfil deve chamar cookieService.delete', () => {
      service.removePermissaoPerfil();
      expect(cryptoServiceSpy.hashKey).toHaveBeenCalledWith(keys.COOKIE_PERMISSAO);
      expect(cookieServiceSpy.delete).toHaveBeenCalledWith(mockHashedKey, '/');
    });
  });

  describe('Gerenciamento de App Token (Cookie)', () => {
    const mockHashedKey = 'hashedCookieKey';
    const mockToken = 'my-app-token';
    const mockEncryptedToken = 'encrypted-token-value';

    beforeEach(() => {
      cryptoServiceSpy.hashKey.withArgs(keys.COOKIE_TOKEN).and.returnValue(mockHashedKey);
      cryptoServiceSpy.encrypt.withArgs(mockToken).and.returnValue(mockEncryptedToken);
      cryptoServiceSpy.decrypt.withArgs(mockEncryptedToken).and.returnValue(mockToken);
    });

    it('setAppToken deve criptografar e definir o cookie de token', () => {
      service.setAppToken(mockToken);
      expect(cryptoServiceSpy.encrypt).toHaveBeenCalledWith(mockToken);
      expect(cookieServiceSpy.set).toHaveBeenCalledWith(
        mockHashedKey,
        mockEncryptedToken,
        { expires: jasmine.any(Date), path: '/' }
      );
    });

    it('getAppToken deve ler e descriptografar o token do cookie', () => {
      cookieServiceSpy.check.withArgs(mockHashedKey).and.returnValue(true);
      cookieServiceSpy.get.withArgs(mockHashedKey).and.returnValue(mockEncryptedToken);

      const token = service.getAppToken();

      expect(cryptoServiceSpy.decrypt).toHaveBeenCalledWith(mockEncryptedToken);
      expect(token).toBe(mockToken);
    });

    it('getAppToken deve retornar nulo se o cookie não for encontrado', () => {
      cookieServiceSpy.check.withArgs(mockHashedKey).and.returnValue(false);
      const token = service.getAppToken();
      expect(token).toBeNull();
    });

    it('removeAppToken deve chamar cookieService.delete', () => {
      service.removeAppToken();
      expect(cookieServiceSpy.delete).toHaveBeenCalledWith(mockHashedKey, '/');
    });
  });

  describe('isAuthenticated', () => {
    it('isAuthenticatedUser deve retornar true se o token existir', () => {
      spyOn(service, 'isAuthenticatedToken').and.returnValue(true);
      expect(service.isAuthenticatedUser()).toBeTrue();
    });

    it('isAuthenticatedUser deve retornar false se o token não existir', () => {
      spyOn(service, 'isAuthenticatedToken').and.returnValue(false);
      expect(service.isAuthenticatedUser()).toBeFalse();
    });

    it('isAuthenticatedToken deve retornar true se o cookie existir', () => {
      cryptoServiceSpy.hashKey.and.returnValue('hashed-key');
      cookieServiceSpy.check.and.returnValue(true);
      expect(service.isAuthenticatedToken()).toBeTrue();
    });

    it('isAuthenticatedToken deve retornar false se o cookie não existir', () => {
      cryptoServiceSpy.hashKey.and.returnValue('hashed-key');
      cookieServiceSpy.check.and.returnValue(false);
      expect(service.isAuthenticatedToken()).toBeFalse();
    });
  });

  it('getToken deve retornar o token do app', () => {
    spyOn(service, 'getAppToken').and.returnValue('token-do-cookie');
    expect(service.getToken()).toBe('token-do-cookie');
  });
});