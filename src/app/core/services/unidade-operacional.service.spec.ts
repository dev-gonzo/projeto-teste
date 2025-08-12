import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { UnidadeOperacionalService } from './unidade-operacional.service';
import { environment } from '../../../environments/environment';
import {
    HistoricoAcoes,
    Page,
    PageResponse,
    ResponseSuccessHttp,
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

describe('UnidadeOperacionalService', () => {
    let service: UnidadeOperacionalService;
    let httpTestingController: HttpTestingController;
    const endpoint = `${environment.apiUrl}/unidades`;
    const urlLogs = `${environment.apiUrl}/unidades/logs`;

    const mockUf: Uf = { id: 25, codigoIbge: 35, nome: 'São Paulo', sigla: 'SP' };
    const mockMunicipio: Municipio = { id: 1, codigoIbge: 3550308, nome: 'São Paulo', uf: mockUf };
    const mockUnidadeOperacional: UnidadeOperacional = {
        id: 1,
        nomeUnidadeOperacional: 'UO Matriz',
        cep: '01000-000',
        municipio: mockMunicipio,
        uf: mockUf,
        status: 'ATIVO'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UnidadeOperacionalService],
        });
        service = TestBed.inject(UnidadeOperacionalService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    describe('query', () => {
        it('deve fazer uma requisição GET com parâmetros e retornar uma página de Unidades Operacionais', () => {
            const params = new HttpParams().set('page', '0').set('size', '10');
            const mockResponse: PageResponse<UnidadeOperacional> = {
                content: [mockUnidadeOperacional],
                totalElements: 1,
            };

            service.query(params).subscribe((page) => {
                expect(page.data).toEqual(mockResponse.content);
                expect(page.count).toBe(1);
                expect(page).toBeInstanceOf(PageImpl);
            });

            const req = httpTestingController.expectOne(`${endpoint}?page=0&size=10`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('getLogs', () => {
        it('deve fazer uma requisição GET para a URL de logs e retornar uma página de HistoricoAcoes', () => {
            const id = 123;
            const params = new HttpParams().set('page', '0').set('size', '5');
            const mockResponse: PageResponse<HistoricoAcoes> = {
                content: [{ idLog: 1, operacao: 'CRIACAO' } as HistoricoAcoes],
                totalElements: 1,
            };

            service.getLogs(params, id).subscribe((page) => {
                expect(page.data).toEqual(mockResponse.content);
                expect(page.count).toBe(1);
            });

            const req = httpTestingController.expectOne(`${urlLogs}/${id}?page=0&size=5`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('getAll', () => {
        it('deve fazer uma requisição GET para a URL findall e retornar um array de Unidades Operacionais', () => {
            const mockUOs: UnidadeOperacional[] = [
                mockUnidadeOperacional,
                { id: 2, nomeUnidadeOperacional: 'UO Filial', status: 'INATIVO' },
            ];

            service.getAll().subscribe((uos) => {
                expect(uos).toEqual(mockUOs);
            });

            const req = httpTestingController.expectOne(`${endpoint}/findall`);
            expect(req.request.method).toBe('GET');
            req.flush(mockUOs);
        });
    });

    describe('listByName', () => {
        it('deve fazer uma requisição GET com o nome na URL e retornar um array', () => {
            const nome = 'Matriz';
            const mockUOs: UnidadeOperacional[] = [mockUnidadeOperacional];

            service.listByName(nome).subscribe((uos) => {
                expect(uos).toEqual(mockUOs);
            });

            const req = httpTestingController.expectOne(`${endpoint}/nome/${nome}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockUOs);
        });
    });

    describe('insert', () => {
        it('deve fazer uma requisição POST com o corpo e cabeçalhos corretos', () => {
            const mockModel: UnidadeOperacional = { id: 0, nomeUnidadeOperacional: 'Nova UO' };
            const mockResponse: ResponseSuccessHttp = { mensagem: 'Criado' };

            service.insert(mockModel).subscribe((response) => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpTestingController.expectOne(endpoint);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockModel);
            expect(req.request.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
            req.flush(mockResponse);
        });
    });

    describe('update', () => {
        it('deve fazer uma requisição PUT para a URL com id, com o corpo e cabeçalhos corretos', () => {
            const mockModel: UnidadeOperacional = { id: 1, nomeUnidadeOperacional: 'UO Atualizada' };
            const mockResponse: ResponseSuccessHttp = { mensagem: 'Atualizado' };

            service.update(mockModel).subscribe((response) => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpTestingController.expectOne(`${endpoint}/${mockModel.id}`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(mockModel);
            req.flush(mockResponse);
        });
    });

    describe('delete', () => {
        it('deve fazer uma requisição DELETE para a URL com id', () => {
            const id = 123;
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
                next: () => fail('deveria ter falhado com um erro'),
                error: (error) => {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe('ID is required');
                    done();
                },
            });
        });
    });

    describe('findById', () => {
        it('deve fazer uma requisição GET para a URL com id', () => {
            const id = 1;
            service.findById(id).subscribe((uo) => {
                expect(uo).toEqual(mockUnidadeOperacional);
            });

            const req = httpTestingController.expectOne(`${endpoint}/${id}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockUnidadeOperacional);
        });
    });

    describe('resolve', () => {
        it('deve chamar findById com o id da rota e retornar a unidade operacional', () => {
            const route = { paramMap: { get: (key: string) => '1' } } as any;
            spyOn(service, 'findById').and.returnValue(of(mockUnidadeOperacional));

            service.resolve(route, {} as RouterStateSnapshot).subscribe((result) => {
                expect(result).toEqual(mockUnidadeOperacional);
            });

            expect(service.findById).toHaveBeenCalledWith(1);
        });

        it('deve retornar um erro se o id não for encontrado na rota', (done: DoneFn) => {
            const route = { paramMap: { get: (key: string) => null } } as any;

            service.resolve(route, {} as RouterStateSnapshot).subscribe({
                error: (error) => {
                    expect(error.message).toContain('ID não encontrado na rota');
                    done();
                },
            });
        });
    });

    describe('baixarModelo', () => {
        it('deve fazer uma requisição GET para baixar um blob e mapear o tipo correto', () => {
            const mockBlob = new Blob(['planilha-fake'], { type: 'application/octet-stream' });

            service.baixarModelo().subscribe((blob) => {
                expect(blob).toBeInstanceOf(Blob);
                expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            });

            const req = httpTestingController.expectOne(`${endpoint}/arquivo-UnidadeOperacional`);
            expect(req.request.method).toBe('GET');
            expect(req.request.responseType).toBe('blob');
            req.flush(mockBlob);
        });
    });

    describe('finalizarUpload', () => {
        it('deve fazer uma requisição POST para a URL de finalizar', () => {
            const mockResponse: ResponseSuccessHttp = { mensagem: 'Finalizado' };

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