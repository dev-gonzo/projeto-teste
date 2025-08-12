import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';

import { PerfilService } from './perfil.service';
import { environment } from '../../../environments/environment';
import { Perfil } from '../../shared/models';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('PerfilService', () => {
  let service: PerfilService;
  let httpTestingController: HttpTestingController;
  let authService: AuthService;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  const endpoint = `${environment.apiUrl}/perfis`;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CookieService', ['get', 'set']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PerfilService,
        AuthService,
        { provide: CookieService, useValue: spy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    cookieServiceSpy = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    service = TestBed.inject(PerfilService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('deve retornar uma lista de perfis e fazer uma requisição GET com o token de autorização', () => {
      const mockToken = 'meu-token-de-teste';

      spyOn(authService, 'getAppToken').and.returnValue(mockToken);

      const mockPerfis: Perfil[] = [
        { id: 1, descricao: 'Administrador' },
        { id: 2, descricao: 'Usuário Padrão' },
      ];

      service.getAll().subscribe((perfis) => {
        expect(perfis).toEqual(mockPerfis);
        expect(perfis.length).toBe(2);
      });

      const req = httpTestingController.expectOne(endpoint);

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${mockToken}`
      );
      expect(req.request.headers.get('Content-Type')).toBe(
        'application/json; charset=utf-8'
      );

      req.flush(mockPerfis);
    });

    it('deve fazer a requisição com "Bearer null" se o token não existir no momento da chamada', () => {
      spyOn(authService, 'getAppToken').and.returnValue(null);

      const mockPerfis: Perfil[] = [];

      service.getAll().subscribe((perfis) => {
        expect(perfis).toEqual(mockPerfis);
      });

      const req = httpTestingController.expectOne(endpoint);

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('');

      req.flush(mockPerfis);
    });
  });
});
