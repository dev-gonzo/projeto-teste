import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { UfService } from './uf.service';
import { environment } from '../../../environments/environment';
import { Uf } from '../../shared/models';

interface AbstractModel<T> {
  id: T;
}

describe('UfService', () => {
  let service: UfService;
  let httpTestingController: HttpTestingController;
  const endpoint = `${environment.apiUrl}/endereco/ufs`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UfService],
    });
    service = TestBed.inject(UfService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('deve fazer uma requisição GET e retornar uma lista de UFs', () => {
      const mockUfs: Uf[] = [
        { id: 1, codigoIbge: 35, nome: 'São Paulo', sigla: 'SP' },
        { id: 2, codigoIbge: 33, nome: 'Rio de Janeiro', sigla: 'RJ' },
        { id: 3, codigoIbge: 29, nome: 'Bahia', sigla: 'BA' },
      ];

      service.getAll().subscribe((ufs) => {
        expect(ufs.length).toBe(3);
        expect(ufs).toEqual(mockUfs);
        expect(ufs[0].sigla).toBe('SP');
      });

      const req = httpTestingController.expectOne(endpoint);

      expect(req.request.method).toBe('GET');

      req.flush(mockUfs);
    });

    it('deve retornar um array vazio se a API não retornar UFs', () => {
      service.getAll().subscribe((ufs) => {
        expect(ufs).toEqual([]);
        expect(ufs.length).toBe(0);
      });

      const req = httpTestingController.expectOne(endpoint);
      expect(req.request.method).toBe('GET');

      req.flush([]);
    });
  });
});