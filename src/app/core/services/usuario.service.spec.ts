import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { UsuarioService } from './usuario.service';
import { environment } from '../../../environments/environment';
import {
  HistoricoAcoes,
  Page,
  PageResponse,
  ResponseSuccessHttp,
  Usuario,
  Perfil,
  Cargo,
  UnidadeOperacional,
  Municipio,
  Uf
} from '../../shared/models';

interface AbstractModel<T> { id: T; }

class PageImpl<T> implements Page<T> {
  data: T[];
  count: number;
  constructor(data: T[], count: number) {
    this.data = data;
    this.count = count;
  }
  static of<T>(content: T[], totalElements: number): Page<T> {
    return new PageImpl(content, totalElements);
  }
}

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpTestingController: HttpTestingController;
  const endpoint = `${environment.apiUrl}/usuarios`;
  const urlLogs = `${environment.apiUrl}/usuarios/logs`;

  const mockPerfil: Perfil = { id: 1, descricao: 'Administrador' };
  const mockCargo: Cargo = { id: 10, descricao: 'Gerente de TI' };
  const mockUf: Uf = { id: 25, codigoIbge: 35, nome: 'São Paulo', sigla: 'SP' };
  const mockMunicipio: Municipio = { id: 1, codigoIbge: 3550308, nome: 'São Paulo', uf: mockUf };
  const mockUnidadeOperacional: UnidadeOperacional = {
    id: 100,
    nomeUnidadeOperacional: 'UO Matriz',
    municipio: mockMunicipio,
    uf: mockUf,
    status: 'ATIVO'
  };

  const mockUsuario: Usuario = {
    id: 1,
    nome: 'Usuário Teste Completo',
    cpf: '111.222.333-44',
    email: 'teste.completo@exemplo.com',
    genero: 'M',
    estadoCivil: 'Solteiro',
    unidadeOperacionalId: 1,
    cargoId: 1,
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService],
    });
    service = TestBed.inject(UsuarioService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('query', () => {
    it('deve fazer uma requisição GET com parâmetros e retornar uma página de Usuários', () => {
      const params = new HttpParams().set('page', '0');
      const mockResponse: PageResponse<Usuario> = {
        content: [mockUsuario],
        totalElements: 1,
      };

      service.query(params).subscribe((page) => {
        expect(page.data).toEqual(mockResponse.content);
        expect(page.count).toBe(1);
        expect(page).toBeDefined();
      });

      const req = httpTestingController.expectOne(`${endpoint}?page=0`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getLogs', () => {
    it('deve fazer uma requisição GET para logs quando o ID é válido', () => {
      const id = 1;
      const params = new HttpParams().set('size', '5');
      const mockResponse: PageResponse<HistoricoAcoes> = {
        content: [{ idLog: 1, operacao: 'ATUALIZACAO' } as HistoricoAcoes],
        totalElements: 1,
      };

      service.getLogs(params, id).subscribe((page) => {
        expect(page.data).toEqual(mockResponse.content);
        expect(page.count).toBe(1);
      });

      const req = httpTestingController.expectOne(`${urlLogs}/${id}?size=5`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('deve retornar um erro observável se o id for undefined', (done: DoneFn) => {
      service.getLogs(new HttpParams(), undefined).subscribe({
        error: (err) => {
          expect(err.message).toBe('ID é obrigatório');
          done();
        },
      });
    });
  });

  describe('insert', () => {
    it('deve fazer uma requisição POST com o corpo do usuário', () => {
      const mockResponse: ResponseSuccessHttp = { mensagem: 'Criado' };

      service.insert(mockUsuario).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(endpoint);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUsuario);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('deve fazer uma requisição PUT quando o ID é válido', () => {
      const id = 1;
      const mockResponse: ResponseSuccessHttp = { mensagem: 'Atualizado' };

      service.update(mockUsuario, id).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${endpoint}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUsuario);
      req.flush(mockResponse);
    });

    it('deve retornar um erro observável se o id for null', (done: DoneFn) => {
      service.update(mockUsuario, 0).subscribe({
        error: (err) => {
          expect(err.message).toBe('ID é obrigatório');
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('deve fazer uma requisição DELETE quando o ID é válido', () => {
      const id = 1;
      const mockResponse: ResponseSuccessHttp = { mensagem: 'Deletado' };

      service.delete(id).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${endpoint}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('deve retornar um erro observável se o id for undefined', (done: DoneFn) => {
      service.delete(undefined).subscribe({
        error: (err) => {
          expect(err.message).toBe('ID é obrigatório');
          done();
        },
      });
    });
  });

  describe('findById', () => {
    it('deve fazer uma requisição GET quando o ID é válido', () => {
      const id = 1;
      service.findById(id).subscribe((user) => {
        expect(user).toEqual(mockUsuario);
      });

      const req = httpTestingController.expectOne(`${endpoint}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });

    it('deve retornar um erro observável se o id for undefined', (done: DoneFn) => {
      service.findById(undefined).subscribe({
        error: (err) => {
          expect(err.message).toBe('ID é obrigatório');
          done();
        },
      });
    });
  });

  describe('resolve', () => {
    it('deve chamar findById com o id da rota e retornar o usuário', () => {
      const route = { paramMap: { get: () => '1' } } as any;
      spyOn(service, 'findById').and.returnValue(of(mockUsuario));

      service.resolve(route, {} as RouterStateSnapshot).subscribe((result) => {
        expect(result).toEqual(mockUsuario);
      });

      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('deve retornar um erro se o id não for encontrado na rota', (done: DoneFn) => {
      const route = { paramMap: { get: () => null } } as any;

      service.resolve(route, {} as RouterStateSnapshot).subscribe({
        error: (err) => {
          expect(err.message).toBe('ID do usuário não fornecido na rota');
          done();
        },
      });
    });
  });

  describe('baixarModelo', () => {
    it('deve fazer uma requisição GET para baixar um blob', () => {
      const mockBlob = new Blob(['dados-da-planilha']);
      service.baixarModelo().subscribe((blob) => {
        expect(blob).toBeInstanceOf(Blob);
        expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      });

      const req = httpTestingController.expectOne(`${endpoint}/arquivo-usuario`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);
    });
  });

  describe('finalizarUpload', () => {
    it('deve fazer uma requisição POST para a URL de finalizar', () => {
      const mockResponse: ResponseSuccessHttp = { mensagem: 'Upload finalizado' };
      service.finalizarUpload().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${endpoint}/finalizar`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });
});