import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CargoService } from './cargo.service';
import { keys } from '../../shared/utils/variables';
import { environment } from '../../../environments/environment';
import { Cargo } from '../../shared/models';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('CargoService', () => {
  let service: CargoService;
  let httpTestingController: HttpTestingController;
  let authService: AuthService;
  const endpoint = `${environment.apiUrl}/cargos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CargoService,
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(CargoService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('deve retornar uma lista de cargos e fazer uma requisição GET com o token de autorização', () => {
      const mockToken = 'meu-token-de-teste';

      spyOn(authService, 'getAppToken').and.returnValue(mockToken);

      const mockCargos: Cargo[] = [
        { id: 1, descricao: 'Desenvolvedor' },
        { id: 2, descricao: 'Analista de QA' },
      ];

      service.getAll().subscribe((cargos) => {
        expect(cargos).toEqual(mockCargos);
        expect(cargos.length).toBe(2);
      });

      const req = httpTestingController.expectOne(endpoint);

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${mockToken}`
      );
      expect(req.request.headers.get('Content-Type')).toBe(
        'application/json; charset=utf-8'
      );

      req.flush(mockCargos);
    });

    it('deve fazer a requisição com "Bearer null" se o token não existir no momento da chamada', () => {
      spyOn(authService, 'getAppToken').and.returnValue(null);

      const mockCargos: Cargo[] = [];

      service.getAll().subscribe((cargos) => {
        expect(cargos).toEqual(mockCargos);
      });

      const req = httpTestingController.expectOne(endpoint);

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(false);

      req.flush(mockCargos);
    });
  });
});
