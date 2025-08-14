import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { UsuarioService } from './usuario.service';
import { environment } from '../../../environments/environment';
import { Usuario, HistoricoAcoes, PageImpl } from '../../shared/models';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const endpoint = `${environment.apiUrl}/usuarios`;
  const urlLogs = `${environment.apiUrl}/usuarios/logs`;

  const mockUsuario: Usuario = {
    id: 1,
    nome: 'Teste',
    cpf: '111.222.333-44',
    email: 'teste@teste.com',
    genero: 'M',
    estadoCivil: 'Solteiro',
    unidadeOperacionalId: 1,
    cargoId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('deve ser criado', () => expect(service).toBeTruthy());

  describe('query', () => {
    it('deve retornar Page<Usuario>', () => {
      const params = new HttpParams().set('page', '0');
      const mockResponse = { content: [mockUsuario], totalElements: 1 };

      service.query(params).subscribe(page => {
        expect(page.data[0]).toEqual(mockUsuario);
        expect(page.count).toBe(1);
      });

      const req = httpMock.expectOne(`${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
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

    it('deve lançar erro se ID undefined', (done) => {
      service.getLogs(new HttpParams(), undefined).subscribe({
        error: err => {
          expect(err.message).toBe('ID é obrigatório');
          done();
        }
      });
    });
  });

  describe('insert', () => {
    it('deve chamar POST', () => {
      const mockResp = { mensagem: 'Criado' };
      service.insert(mockUsuario).subscribe(res => expect(res).toEqual(mockResp));

      const req = httpMock.expectOne(`${endpoint}/autocadastro`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResp);
    });
  });

  describe('update', () => {
    it('deve chamar PUT', () => {
      const mockResp = { mensagem: 'Atualizado' };
      service.update(mockUsuario, 1).subscribe(res => expect(res).toEqual(mockResp));

      const req = httpMock.expectOne(`${endpoint}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResp);
    });

    it('deve lançar erro se ID undefined', (done) => {
      service.update(mockUsuario, undefined).subscribe({
        error: err => {
          expect(err.message).toBe('ID é obrigatório');
          done();
        }
      });
    });
  });

  describe('delete', () => {
    it('deve chamar DELETE', () => {
      const mockResp = { mensagem: 'Deletado' };
      service.delete(1).subscribe(res => expect(res).toEqual(mockResp));

      const req = httpMock.expectOne(`${endpoint}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResp);
    });
  });

  describe('resolve', () => {
    it('deve resolver usuário pelo ID da rota', () => {
      const route = { paramMap: convertToParamMap({ id: '1' }) } as ActivatedRouteSnapshot;
      spyOn(service, 'findById').and.returnValue(of(mockUsuario));

      service.resolve(route, {} as RouterStateSnapshot).subscribe(res => {
        expect(res).toEqual(mockUsuario);
      });

      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se ID não estiver na rota', (done) => {
      const route = { paramMap: convertToParamMap({}) } as ActivatedRouteSnapshot;
      service.resolve(route, {} as RouterStateSnapshot).subscribe({
        error: err => {
          expect(err.message).toBe('ID do usuário não fornecido na rota');
          done();
        }
      });
    });
  });
});
