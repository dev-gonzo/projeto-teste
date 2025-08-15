import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { UnidadeOperacionalService } from './unidade-operacional.service';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import {
  UnidadeOperacional,
  HistoricoAcoes,
  Endereco,
  PageImpl
} from '../../shared/models';

describe('UnidadeOperacionalService', () => {
  let service: UnidadeOperacionalService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const endpoint = `${environment.apiUrl}/unidade-operacional`;
  const urlLogs = `${environment.apiUrl}/unidades/logs`;

  const mockUnidade: UnidadeOperacional = {
    id: 1,
    nomeUnidadeOperacional: 'UO Teste',
    status: 'ATIVO',
    responsavelUnidadeOperacional: 'Responsável',
    numeroTelefonePrincipal: '1111-1111',
    numeroTelefoneSecundario: '2222-2222',
    endereco: {
      municipioNome: 'Cidade Teste',
      bairro: 'Bairro Teste',
      logradouro: 'Rua Teste',
      numero: 123,
      cep: '12345-678',
      estadoSigla: 'ST'
    } as Endereco
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UnidadeOperacionalService,
        { provide: AuthService, useValue: authServiceSpy },
        CookieService
      ]
    });

    service = TestBed.inject(UnidadeOperacionalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('query', () => {
    it('deve retornar Page<UnidadeOperacional>', () => {
      const params = new HttpParams().set('page', '0');
      const response = {
        _embedded: { unidadeOperacionalDTOList: [mockUnidade] },
        page: { totalElements: 1 }
      };

      service.query(params).subscribe(page => {
        expect(page.data[0].nomeUnidadeOperacional).toBe('UO Teste');
        expect(page.count).toBe(1);
      });

      const req = httpMock.expectOne(r => r.url === endpoint);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });

  describe('getLogs', () => {
    it('deve retornar logs', () => {
      const params = new HttpParams();
      const mockResponse = { content: [{ idLog: 1, operacao: 'ATUALIZACAO' } as HistoricoAcoes], totalElements: 1 };

      service.getLogs(params, 1).subscribe(page => {
        expect(page.data.length).toBe(1);
        expect(page.count).toBe(1);
      });

      const req = httpMock.expectOne(`${urlLogs}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('insert', () => {
    it('deve chamar POST', () => {
      const mockResp = { mensagem: 'Criado' };
      service.insert(mockUnidade).subscribe(res => expect(res).toEqual(mockResp));

      const req = httpMock.expectOne(endpoint);
      expect(req.request.method).toBe('POST');
      req.flush(mockResp);
    });
  });

  describe('update', () => {
    it('deve chamar PUT', () => {
      const mockResp = { mensagem: 'Atualizado' };
      service.update(mockUnidade).subscribe(res => expect(res).toEqual(mockResp));

      const req = httpMock.expectOne(`${endpoint}/${mockUnidade.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResp);
    });
  });

  describe('delete', () => {
    it('deve chamar DELETE com ID válido', () => {
      const mockResp = { mensagem: 'Deletado' };
      service.delete(1).subscribe(res => expect(res).toEqual(mockResp));

      const req = httpMock.expectOne(`${endpoint}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResp);
    });

    it('deve lançar erro se ID indefinido', (done) => {
      service.delete(undefined).subscribe({
        error: (err) => {
          expect(err.message).toBe('ID is required');
          done();
        }
      });
    });
  });

  describe('findById', () => {
    it('deve chamar GET', () => {
      service.findById(1).subscribe(res => expect(res).toEqual(mockUnidade));

      const req = httpMock.expectOne(`${endpoint}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUnidade);
    });
  });

  describe('resolve', () => {
    it('deve resolver unidade pelo ID da rota', () => {
      const route = { paramMap: convertToParamMap({ id: '1' }) } as ActivatedRouteSnapshot;
      spyOn(service, 'findById').and.returnValue(of(mockUnidade));

      service.resolve(route, {} as RouterStateSnapshot).subscribe(res => {
        expect(res).toEqual(mockUnidade);
      });

      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se ID não estiver na rota', (done) => {
      const route = { paramMap: convertToParamMap({}) } as ActivatedRouteSnapshot;
      service.resolve(route, {} as RouterStateSnapshot).subscribe({
        error: (err) => {
          expect(err.message).toBe('ID não encontrado na rota');
          done();
        }
      });
    });
  });
});
